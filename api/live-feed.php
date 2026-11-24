<?php
/**
 * Live Database Monitor / Feed Endpoint
 * Endpoint: GET /api/live-feed.php
 * Designed specifically for B.Tech college presentations to prove live MySQL integration!
 */
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();

try {
    // 1. Fetch recent contact queries
    $stmt1 = $pdo->query("SELECT id, full_name, email, subject, category, created_at, status 
                          FROM contact_messages 
                          ORDER BY id DESC LIMIT 5");
    $contacts = $stmt1->fetchAll();

    // 2. Fetch recent feedback reviews
    $stmt2 = $pdo->query("SELECT id, user_name, user_role, rating, feedback_category, comments, created_at 
                          FROM feedback_reviews 
                          ORDER BY id DESC LIMIT 5");
    $feedbacks = $stmt2->fetchAll();

    // 3. Fetch recent water calculations
    $stmt3 = $pdo->query("SELECT id, user_name, family_members, daily_liters, per_capita_daily, efficiency_grade, created_at 
                          FROM water_usage_records 
                          ORDER BY id DESC LIMIT 5");
    $calculations = $stmt3->fetchAll();

    // 4. Fetch recent pledges
    $stmt4 = $pdo->query("SELECT id, full_name, institution, target_liters_to_save, pledge_action, created_at 
                          FROM water_pledges 
                          ORDER BY id DESC LIMIT 5");
    $pledges = $stmt4->fetchAll();

    // Summary counts
    $counts = [
        'messages'     => (int)$pdo->query("SELECT COUNT(*) FROM contact_messages")->fetchColumn(),
        'feedbacks'    => (int)$pdo->query("SELECT COUNT(*) FROM feedback_reviews")->fetchColumn(),
        'audits'       => (int)$pdo->query("SELECT COUNT(*) FROM water_usage_records")->fetchColumn(),
        'pledges'      => (int)$pdo->query("SELECT COUNT(*) FROM water_pledges")->fetchColumn(),
        'server_time'  => date('Y-m-d H:i:s T'),
        'database'     => 'MySQL (water_management_db)'
    ];

    sendJsonResponse('success', 'Live database records loaded successfully.', [
        'summary'      => $counts,
        'contacts'     => $contacts,
        'feedbacks'    => $feedbacks,
        'calculations' => $calculations,
        'pledges'      => $pledges
    ]);

} catch (PDOException $e) {
    sendJsonResponse('error', 'Error fetching live database status.', ['diagnostic' => $e->getMessage()], 500);
}
?>