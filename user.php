<?php
// ============================================================
//  Current User API
//  GET: Returns current logged-in user info from session
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

$userId = $_SESSION['user_id'] ?? null;
$username = $_SESSION['username'] ?? null;

if ($userId && $username) {
    jsonResponse([
        'success' => true,
        'authenticated' => true,
        'user' => [
            'id' => $userId,
            'username' => $username
        ]
    ]);
} else {
    jsonResponse([
        'success' => true,
        'authenticated' => false,
        'user' => null
    ]);
}
