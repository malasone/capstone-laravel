<?php
// Database connection
$host = 'localhost'; // Your database host
$dbname = 'starbox_coffee'; // Your database name
$username = 'root'; // Your MySQL username
$password = ''; // Your MySQL password

header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch all saved receipts
    $stmt = $pdo->query("SELECT id, items, total, created_at FROM receipts ORDER BY created_at DESC");
    $receipts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the receipts as JSON
    echo json_encode(['success' => true, 'receipts' => $receipts]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
