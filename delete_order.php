<?php
$host = 'localhost'; // Your database host
$dbname = 'starbox_coffee'; // Your database name
$username = 'root'; // Your MySQL username
$password = ''; // Your MySQL password

header('Content-Type: application/json');

// Get the input from the fetch request
$data = json_decode(file_get_contents("php://input"), true);

// Check if data was parsed correctly and ID is present
if ($data !== null && isset($data['id'])) {
    $orderId = $data['id'];

    // Query to delete the order from the database
    $stmt = $conn->prepare("DELETE FROM receipts WHERE id = ?");
    $stmt->bind_param("i", $orderId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to delete order']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid input or order ID']);
}

$conn->close();
?>
