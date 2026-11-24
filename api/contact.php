<?php
/**
 * Contact Message Submission Endpoint
 * Endpoint: POST /api/contact.php
 */
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse('error', 'Invalid request method. Only POST allowed.', [], 405);
}

// Read raw JSON body or $_POST
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true);

if (!is_array($inputData)) {
    $inputData = $_POST;
}

$fullName = trim($inputData['full_name'] ?? '');
$email    = trim($inputData['email'] ?? '');
$phone    = trim($inputData['phone'] ?? '');
$subject  = trim($inputData['subject'] ?? '');
$category = trim($inputData['category'] ?? 'General Inquiry');
$message  = trim($inputData['message'] ?? '');

// Validation
$errors = [];
if (empty($fullName) || strlen($fullName) < 2) {
    $errors[] = 'Full name must be at least 2 characters.';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}
if (empty($subject) || strlen($subject) < 3) {
    $errors[] = 'Subject must be at least 3 characters.';
}
if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Message content must be at least 10 characters long.';
}

if (!empty($errors)) {
    sendJsonResponse('validation_failed', 'Validation failed on submitted fields.', ['errors' => $errors], 422);
}

// Client IP
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

$pdo = getDbConnection();

try {
    $sql = "INSERT INTO contact_messages (full_name, email, phone, subject, category, message, ip_address) 
            VALUES (:full_name, :email, :phone, :subject, :category, :message, :ip_address)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':full_name'  => htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8'),
        ':email'      => $email,
        ':phone'      => htmlspecialchars($phone, ENT_QUOTES, 'UTF-8'),
        ':subject'    => htmlspecialchars($subject, ENT_QUOTES, 'UTF-8'),
        ':category'   => $category,
        ':message'    => htmlspecialchars($message, ENT_QUOTES, 'UTF-8'),
        ':ip_address' => $ipAddress
    ]);

    $insertId = $pdo->lastInsertId();

    sendJsonResponse('success', 'Thank you! Your message has been saved to the MySQL database. Our team will review it shortly.', [
        'id'        => $insertId,
        'full_name' => $fullName,
        'email'     => $email,
        'category'  => $category,
        'subject'   => $subject
    ], 201);

} catch (PDOException $e) {
    sendJsonResponse('error', 'Failed to store contact message into database.', [
        'diagnostic' => $e->getMessage()
    ], 500);
}
?>