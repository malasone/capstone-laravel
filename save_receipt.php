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

    // Get the JSON data from the request
    $data = json_decode(file_get_contents('php://input'), true);

    // Log the received data to help debug
    file_put_contents('log.txt', print_r($data, true));  // This will write data to log.txt file

    // Check if data is received correctly
    if (!$data || !isset($data['items']) || !isset($data['total'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid data received', 'data' => $data]);
        exit;
    }

    // Prepare SQL query to insert receipt data
    $stmt = $pdo->prepare("INSERT INTO receipts (items, total, created_at) VALUES (:items, :total, NOW())");
    $stmt->bindParam(':items', json_encode($data['items']));
    $stmt->bindParam(':total', $data['total']);

    // Execute the query and return response
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save the receipt']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
