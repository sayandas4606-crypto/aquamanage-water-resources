<?php
/**
 * Water Usage Calculation Audit Endpoint
 * Endpoint: POST /api/calc-record.php
 */
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse('error', 'Only POST method is allowed.', [], 405);
}

$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true);

if (!is_array($inputData)) {
    $inputData = $_POST;
}

$userName        = trim($inputData['user_name'] ?? 'College Student');
$familyMembers   = max(1, intval($inputData['family_members'] ?? 1));
$dailyLiters     = floatval($inputData['daily_liters'] ?? 0);
$monthlyLiters   = floatval($inputData['monthly_liters'] ?? ($dailyLiters * 30));
$annualLiters    = floatval($inputData['annual_liters'] ?? ($dailyLiters * 365));
$perCapitaDaily  = floatval($inputData['per_capita_daily'] ?? ($dailyLiters / $familyMembers));
$efficiencyGrade = trim($inputData['efficiency_grade'] ?? 'Moderate (Conscious)');
$breakdownJson   = isset($inputData['breakdown']) ? json_encode($inputData['breakdown']) : '{}';

if ($dailyLiters <= 0) {
    sendJsonResponse('validation_failed', 'Calculated daily consumption must be greater than zero.', [], 422);
}

$pdo = getDbConnection();

try {
    $sql = "INSERT INTO water_usage_records (user_name, family_members, daily_liters, monthly_liters, annual_liters, per_capita_daily, efficiency_grade, breakdown_json) 
            VALUES (:user_name, :family_members, :daily_liters, :monthly_liters, :annual_liters, :per_capita_daily, :efficiency_grade, :breakdown_json)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':user_name'        => htmlspecialchars($userName, ENT_QUOTES, 'UTF-8'),
        ':family_members'   => $familyMembers,
        ':daily_liters'     => $dailyLiters,
        ':monthly_liters'   => $monthlyLiters,
        ':annual_liters'    => $annualLiters,
        ':per_capita_daily' => $perCapitaDaily,
        ':efficiency_grade' => $efficiencyGrade,
        ':breakdown_json'   => $breakdownJson
    ]);

    sendJsonResponse('success', 'Water audit recorded in database.', [
        'id'               => $pdo->lastInsertId(),
        'per_capita_daily' => $perCapitaDaily,
        'efficiency_grade' => $efficiencyGrade
    ], 201);

} catch (PDOException $e) {
    sendJsonResponse('error', 'Database write error for water record.', ['diagnostic' => $e->getMessage()], 500);
}
?>