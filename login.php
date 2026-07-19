<?php
// ============================================================
//  Login API
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

try {
    $db = getDB();
    
    $stmt = $db->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        jsonResponse(['success' => false, 'message' => 'Invalid username or password'], 401);
    }
    
    $user = $result->fetch_assoc();
    $stmt->close();
    
    if (!password_verify($password, $user['password'])) {
        jsonResponse(['success' => false, 'message' => 'Invalid username or password'], 401);
    }
    
    // Start session and regenerate ID to prevent session fixation
    initSession();
    session_regenerate_id(true);
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    
    // Log login
    $logStmt = $db->prepare("INSERT INTO history (user_id, action) VALUES (?, 'Logged in')");
    $logStmt->bind_param('i', $user['id']);
    $logStmt->execute();
    $logStmt->close();
    
    jsonResponse([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'username' => $user['username']
        ]
    ]);
    
} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
