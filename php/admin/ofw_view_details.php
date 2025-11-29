<?php
// Database connection
$host = "localhost";
$user = "root";
$pass = "";
$db = "pmdlwebsite";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Check if ID is provided
if (!isset($_POST['id']) || empty($_POST['id'])) {
    echo json_encode(['error' => 'Missing OFW ID']);
    exit;
}

$id = intval($_POST['id']);

// Prepare SQL
$sql = "SELECT Name, Destination, Position, Status FROM ofw_records WHERE Ofw_ID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['error' => 'No record found for ID ' . $id]);
    exit;
}

$row = $result->fetch_assoc();

// Convert numeric → text
switch ($row['Status']) {
    case 1: $row['Status'] = "Pending"; break;
    case 2: $row['Status'] = "Complete"; break;
    case 3: $row['Status'] = "Incomplete"; break;
    default: $row['Status'] = "Unknown";
}

echo json_encode($row);
?>
