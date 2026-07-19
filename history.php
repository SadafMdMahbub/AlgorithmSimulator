<?php
// ============================================================
//  History API
//  GET:  Returns usage history for current user
//  POST: Adds a new history entry { action }
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
        // Get history
        $stmt = $db->prepare("SELECT action, created_at as time FROM history WHERE user_id = ? ORDER BY created_at DESC LIMIT 100");
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $history = [];
        while ($row = $result->fetch_assoc()) {
            $history[] = [
                'action' => $row['action'],
                'time' => date('M j, Y g:i A', strtotime($row['time']))
            ];
        }
        $stmt->close();
        
        jsonResponse(['success' => true, 'history' => $history]);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || empty($input['action'])) {
            jsonResponse(['success' => false, 'message' => 'Action is required'], 400);
        }
        
        $action = trim($input['action']);
        
        $stmt = $db->prepare("INSERT INTO history (user_id, action) VALUES (?, ?)");
        $stmt->bind_param('is', $userId, $action);
        
        if ($stmt->execute()) {
            jsonResponse(['success' => true, 'message' => 'History entry added', 'id' => $stmt->insert_id]);
        } else {
            jsonResponse(['success' => false, 'message' => 'Failed to add history entry'], 500);
        }
        $stmt->close();
    } else {
        jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
    }
    
} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
