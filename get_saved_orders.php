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

    // Query to get saved orders
    $stmt = $pdo->query("SELECT id,items, total, created_at FROM receipts ORDER BY created_at DESC");

    $orders = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $orders[] = [
            'id' => $row['id'],   // Make sure 'id' is returned
            'items' => $row['items'],
            'total' => $row['total'],
            'created_at' => $row['created_at']
        ];
    }

    // Return the orders as JSON
    echo json_encode(['orders' => $orders]);
} catch (PDOException $e) {
    echo json_encode(['orders' => [], 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
<?php