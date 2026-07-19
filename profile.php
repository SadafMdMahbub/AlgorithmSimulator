<?php
// ============================================================
//  Profile API
//  GET:  Returns current user profile
//  POST: Updates user profile fields (full_name, email)
// ============================================================
require_once __DIR__ . '/database/db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check authentication
$userId = getCurrentUserId();
if (!$userId) {
    jsonResponse(['success' => false, 'message' => 'Not authenticated'], 401);
}

try {
    $db = getDB();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $db->prepare("SELECT id, username, full_name, email, created_at FROM users WHERE id = ?");
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            jsonResponse(['success' => false, 'message' => 'User not found'], 404);
        }
        
        $user = $result->fetch_assoc();
        $stmt->close();
        
        jsonResponse(['success' => true, 'user' => $user]);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            jsonResponse(['success' => false, 'message' => 'No data provided'], 400);
        }
        
        $updates = [];
        $types = '';
        $values = [];
        
        if (isset($input['full_name'])) {
            $updates[] = 'full_name = ?';
            $types .= 's';
            $values[] = trim($input['full_name']);
        }
        
        if (isset($input['email'])) {
            $updates[] = 'email = ?';
            $types .= 's';
            $values[] = trim($input['email']);
        }
        
        if (empty($updates)) {
            jsonResponse(['success' => false, 'message' => 'No valid fields to update'], 400);
        }
        
        $sql = 'UPDATE users SET ' . implode(', ', $updates) . ' WHERE id = ?';
        $types .= 'i';
        $values[] = $userId;
        
        $stmt = $db->prepare($sql);
        $stmt->bind_param($types, ...$values);
        
        if ($stmt->execute()) {
            jsonResponse(['success' => true, 'message' => 'Profile updated successfully']);
        } else {
            jsonResponse(['success' => false, 'message' => 'Failed to update profile'], 500);
        }
        $stmt->close();
    } else {
        jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
    }
    
} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
