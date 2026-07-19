<?php
// ============================================================
//  Logout API
//  GET: Destroys the current PHP session
// ============================================================
require_once __DIR__ . '/database/db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

initSession();

// Log logout if user was logged in
$userId = $_SESSION['user_id'] ?? null;
if ($userId) {
    try {
        $db = getDB();
        $logStmt = $db->prepare("INSERT INTO history (user_id, action) VALUES (?, 'Logged out')");
        $logStmt->bind_param('i', $userId);
        $logStmt->execute();
        $logStmt->close();
    } catch (Exception $e) {
        // Ignore logging errors on logout
    }
}

// Destroy session
$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params['path'], $params['domain'],
        $params['secure'], $params['httponly']
    );
}

session_destroy();

jsonResponse(['success' => true, 'message' => 'Logged out successfully']);
