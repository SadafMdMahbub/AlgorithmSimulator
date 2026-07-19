<?php
// ============================================================
//  Database Configuration for AlgoViz
//  Uses XAMPP MySQL (default: root with no password)
// ============================================================
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'algoviz');

// Create connection
function getDB() {
    static $conn = null;
    if ($conn === null) {
        try {
            $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            if ($conn->connect_error) {
                // Try to create the database if it doesn't exist
                $tempConn = new mysqli(DB_HOST, DB_USER, DB_PASS);
                $tempConn->query("CREATE DATABASE IF NOT EXISTS " . DB_NAME);
                $tempConn->close();
                
                $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
                if ($conn->connect_error) {
                    http_response_code(500);
                    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
                }
                
                // Create tables
                initTables($conn);
            }
        } catch (Exception $e) {
            http_response_code(500);
            die(json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]));
        }
    }
    return $conn;
}

function initTables($conn) {
    $sql = "
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) DEFAULT '',
        email VARCHAR(100) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        action VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS user_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        session_token VARCHAR(64) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    
    // Execute multi-query
    $queries = explode(';', $sql);
    foreach ($queries as $query) {
        $query = trim($query);
        if (!empty($query)) {
            $conn->query($query);
        }
    }
}

// JSON response helper
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Start session for API calls
function initSession() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

// Get the current logged-in user ID (from session)
function getCurrentUserId() {
    initSession();
    return $_SESSION['user_id'] ?? null;
}

// Generate a secure session token
function generateToken() {
    return bin2hex(random_bytes(32));
}
