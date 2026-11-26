<?php
/**
 * Database Connection Configuration
 * Project: Water Resources & Management Portal (B.Tech CSE Project)
 * Technology: PHP PDO with MySQL / MariaDB
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Credentials
// Credentials MUST be set via server environment variables or local web server configuration
$host     = getenv('DB_HOST') ?: '127.0.0.1';
$dbname   = getenv('DB_NAME') ?: 'water_management_db';
$username = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASS') ?: '';
$port     = getenv('DB_PORT') ?: '3306';

$dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
];

$pdo = null;
$db_connected = false;
$db_error_message = '';

try {
    $pdo = new PDO($dsn, $username, $password, $options);
    $db_connected = true;
} catch (PDOException $e) {
    $db_connected = false;
    $db_error_message = $e->getMessage();
}

/**
 * Helper function to safely send JSON response
 */
function sendJsonResponse($status, $message, $data = [], $httpCode = 200) {
    http_response_code($httpCode);
    echo json_encode([
        'status'    => $status,
        'message'   => $message,
        'data'      => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit();
}

/**
 * Return PDO or fail with structured JSON
 */
function getDbConnection() {
    global $pdo, $db_connected, $db_error_message;
    if (!$db_connected || !$pdo) {
        sendJsonResponse('error', 'Database connection failed. Ensure MySQL service is running in XAMPP and "water_management_db" database is imported.', [
            'diagnostic' => $db_error_message,
            'hint' => 'Run XAMPP Control Panel, start Apache & MySQL, and import database.sql via phpMyAdmin.'
        ], 500);
    }
    return $pdo;
}
?>