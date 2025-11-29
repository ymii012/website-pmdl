<?php
// for view joborder
header("Content-Type: application/json");
require_once "../connect.php";

if (!isset($_GET["id"])) {
    echo json_encode(["error" => "Missing job ID"]);
    exit;
}

$jobId = intval($_GET["id"]);

$sql = "SELECT * FROM job_order WHERE JobOrder_Id = $jobId LIMIT 1";
$result = $conn->query($sql);

if (!$result || $result->num_rows === 0) {
    echo json_encode(["error" => "Job not found"]);
    exit;
}

$row = $result->fetch_assoc();

// Convert numeric status to text
$statusText = [
    1 => "Active",
    2 => "Pending",
    3 => "Closed"
];

$row["status_text"] = $statusText[$row["status"]] ?? "Unknown";

// Format the created timestamp
if (!empty($row["time_created"])) {
    $row["posted_date"] = date("M d, Y", strtotime($row["time_created"]));
} else {
    $row["posted_date"] = null;
}

echo json_encode($row);
?>
