<?php
/**
 * Water Saving Pledge Endpoint
 * Endpoints:
 *   POST /api/pledge.php (Submit a pledge)
 *   GET  /api/pledge.php (Get total pledges count and recent pledges)
 */
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $countStmt = $pdo->query("SELECT COUNT(*) as total_pledges, COALESCE(SUM(target_liters_to_save), 0) as total_liters FROM water_pledges");
        $stats = $countStmt->fetch();

        $recentStmt = $pdo->query("SELECT full_name, institution, target_liters_to_save, pledge_action, created_at 
                                  FROM water_pledges 
                                  ORDER BY id DESC LIMIT 5");
        $recent = $recentStmt->fetchAll();

        sendJsonResponse('success', 'Pledge stats loaded.', [
            'total_pledges' => (int)$stats['total_pledges'],
            'total_liters'  => (int)$stats['total_liters'],
            'recent'        => $recent
        ]);
    } catch (PDOException $e) {
        sendJsonResponse('error', 'Error fetching pledge stats.', ['diagnostic' => $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $inputData = json_decode($rawInput, true);

    if (!is_array($inputData)) {
        $inputData = $_POST;
    }

    $fullName     = trim($inputData['full_name'] ?? '');
    $institution  = trim($inputData['institution'] ?? 'College Campus');
    $targetLiters = intval($inputData['target_liters_to_save'] ?? 50);
    $pledgeAction = trim($inputData['pledge_action'] ?? 'Turn off tap while brushing and fix leaks');

    if (empty($fullName)) {
        sendJsonResponse('validation_failed', 'Your name is required to take the pledge.', [], 422);
    }
    if ($targetLiters < 5) {
        $targetLiters = 50;
    }

    try {
        $sql = "INSERT INTO water_pledges (full_name, institution, target_liters_to_save, pledge_action) 
                VALUES (:full_name, :institution, :target_liters, :pledge_action)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':full_name'     => htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8'),
            ':institution'   => htmlspecialchars($institution, ENT_QUOTES, 'UTF-8'),
            ':target_liters' => $targetLiters,
            ':pledge_action' => htmlspecialchars($pledgeAction, ENT_QUOTES, 'UTF-8')
        ]);

        $countStmt = $pdo->query("SELECT COUNT(*) as total_pledges, COALESCE(SUM(target_liters_to_save), 0) as total_liters FROM water_pledges");
        $stats = $countStmt->fetch();

        sendJsonResponse('success', 'Congratulations! Your water conservation pledge is now registered.', [
            'id'            => $pdo->lastInsertId(),
            'total_pledges' => (int)$stats['total_pledges'],
            'total_liters'  => (int)$stats['total_liters']
        ], 201);

    } catch (PDOException $e) {
        sendJsonResponse('error', 'Failed to record pledge in database.', ['diagnostic' => $e->getMessage()], 500);
    }
}

sendJsonResponse('error', 'Method not allowed', [], 405);
?>