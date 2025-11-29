<?php
header("Content-Type: application/json");
require_once "../connect.php";

if (!isset($_GET["job_id"])) {
    echo json_encode(["error" => "Missing job ID"]);
    exit;
}

$jobId = intval($_GET["job_id"]);

$sql = "
    SELECT 
        a.Application_ID,
        o.Name AS applicant_name,
        o.Status AS applicant_status,
        o.Last_Updated AS application_date
    FROM application a
    INNER JOIN ofw_records o 
        ON a.Ofw_ID = o.OFW_ID
    WHERE a.JobOrder_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $jobId);
$stmt->execute();
$result = $stmt->get_result();

$applicants = [];

while ($row = $result->fetch_assoc()) {

    // ✅ SAME STATUS MAPPING AS YOUR OFW VIEW FILE
    switch ((int)$row['applicant_status']) {
        case 1: $statusText = "Pending"; break;
        case 2: $statusText = "Complete"; break;
        case 3: $statusText = "Incomplete"; break;
        default: $statusText = "Unknown"; break;
    }

    $formattedDate = "—";
    if (!empty($row["application_date"])) {
        $formattedDate = date("M d, Y", strtotime($row["application_date"]));
    }

    $applicants[] = [
        "application_id" => $row["Application_ID"],
        "applicant_name" => $row["applicant_name"],   // ✅ NAME NOW GUARANTEED
        "status_text"    => $statusText,
        "formatted_date"=> $formattedDate
    ];
}

echo json_encode($applicants);
