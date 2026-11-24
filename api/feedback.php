<?php
/**
 * Feedback & Review Endpoint
 * Endpoints: 
 *   POST /api/feedback.php (Submit review)
 *   GET  /api/feedback.php (List approved reviews)
 */
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();

// GET Request: Fetch approved reviews
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT id, user_name, user_role, rating, feedback_category, comments, created_at 
                             FROM feedback_reviews 
                             WHERE is_approved = 1 
                             ORDER BY id DESC 
                             LIMIT 12");
        $reviews = $stmt->fetchAll();
        sendJsonResponse('success', 'Reviews fetched successfully.', ['reviews' => $reviews]);
    } catch (PDOException $e) {
        sendJsonResponse('error', 'Error fetching feedback reviews.', ['diagnostic' => $e->getMessage()], 500);
    }
}

// POST Request: Submit new review
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $inputData = json_decode($rawInput, true);

    if (!is_array($inputData)) {
        $inputData = $_POST;
    }

    $userName     = trim($inputData['user_name'] ?? '');
    $userEmail    = trim($inputData['user_email'] ?? '');
    $userRole     = trim($inputData['user_role'] ?? 'Student');
    $rating       = intval($inputData['rating'] ?? 5);
    $category     = trim($inputData['feedback_category'] ?? 'Overall Quality');
    $comments     = trim($inputData['comments'] ?? '');

    $errors = [];
    if (empty($userName) || strlen($userName) < 2) {
        $errors[] = 'Your name is required (at least 2 characters).';
    }
    if (empty($userEmail) || !filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'A valid email address is required.';
    }
    if ($rating < 1 || $rating > 5) {
        $errors[] = 'Rating must be an integer between 1 and 5.';
    }
    if (empty($comments) || strlen($comments) < 5) {
        $errors[] = 'Please provide constructive feedback (minimum 5 characters).';
    }

    if (!empty($errors)) {
        sendJsonResponse('validation_failed', 'Validation failed.', ['errors' => $errors], 422);
    }

    try {
        $sql = "INSERT INTO feedback_reviews (user_name, user_email, user_role, rating, feedback_category, comments, is_approved) 
                VALUES (:user_name, :user_email, :user_role, :rating, :category, :comments, 1)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':user_name'  => htmlspecialchars($userName, ENT_QUOTES, 'UTF-8'),
            ':user_email' => $userEmail,
            ':user_role'  => $userRole,
            ':rating'     => $rating,
            ':category'   => htmlspecialchars($category, ENT_QUOTES, 'UTF-8'),
            ':comments'   => htmlspecialchars($comments, ENT_QUOTES, 'UTF-8')
        ]);

        sendJsonResponse('success', 'Your feedback and rating have been recorded in the database! Thank you.', [
            'id'        => $pdo->lastInsertId(),
            'user_name' => $userName,
            'rating'    => $rating
        ], 201);

    } catch (PDOException $e) {
        sendJsonResponse('error', 'Failed to store feedback in database.', ['diagnostic' => $e->getMessage()], 500);
    }
}

sendJsonResponse('error', 'Method not allowed', [], 405);
?>