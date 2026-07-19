<?php
// ============================================================
//  Register API
//  POST: { username, password }
// ============================================================
require_once __DIR__ . '/database/db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['username']) || empty($input['password'])) {
    jsonResponse(['success' => false, 'message' => 'Username and password are required'], 400);
}

$username = trim($input['username']);
$password = $input['password'];

if (strlen($username) < 3 || strlen($username) > 50) {
    jsonResponse(['success' => false, 'message' => 'Username must be between 3 and 50 characters'], 400);
}

if (strlen($password) < 4) {
    jsonResponse(['success' => false, 'message' => 'Password must be at least 4 characters'], 400);
}

try {
    $db = getDB();
    
    // Check if user exists
    $stmt = $db->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        jsonResponse(['success' => false, 'message' => 'User already exists'], 409);
    }
    $stmt->close();
    
    // Create user
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param('ss', $username, $hashedPassword);
    
    if ($stmt->execute()) {
        $userId = $stmt->insert_id;
        
        // Create session
        initSession();
        $_SESSION['user_id'] = $userId;
        $_SESSION['username'] = $username;
        
        // Log registration
        $logStmt = $db->prepare("INSERT INTO history (user_id, action) VALUES (?, 'Registered account')");
        $logStmt->bind_param('i', $userId);
        $logStmt->execute();
        $logStmt->close();
        
        jsonResponse([
            'success' => true,
            'message' => 'Registration successful',
            'user' => [
                'id' => $userId,
                'username' => $username
            ]
        ]);
    } else {
        jsonResponse(['success' => false, 'message' => 'Registration failed: ' . $db->error], 500);
    }
    $stmt->close();
    
} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
