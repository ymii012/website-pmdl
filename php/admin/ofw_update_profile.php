<?php
// Database Connection
$host = 'localhost';
$dbname = 'pmdlwebsite';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
    exit;
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $ofw_id = $_POST['ofw_id'] ?? '';
        $statusText = $_POST['status'] ?? '';

        if (empty($ofw_id) || empty($statusText)) {
            echo json_encode(['error' => 'Missing required fields']);
            exit;
        }

        // Convert text → numeric
       // Convert incoming value to numeric status code
switch ($statusText) {
    case "Pending":
    case "1":
    case 1:
        $status = 1;
        break;

    case "Complete":
    case "2":
    case 2:
        $status = 2;
        break;

    case "In Progress":
    case "Incomplete":
    case "3":
    case 3:
        $status = 3;
        break;

    default:
        echo json_encode(['error' => 'Invalid status value: ' . $statusText]);
        exit;
}



        // Update Query
        $sql = "UPDATE ofw_records SET Status = ? WHERE Ofw_ID = ?";
        $stmt = $pdo->prepare($sql);
        $success = $stmt->execute([$status, $ofw_id]);

        echo json_encode(['success' => $success]);

    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
