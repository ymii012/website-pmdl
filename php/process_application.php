<?php
include 'connect.php';

$JobOrderID = $_POST['JobOrder_Id'] ?? null;

// VALIDATION
// =====================================================
if (!$JobOrderID) {
    die("Error: Missing Job Order ID.");
}


// INSERT APPLICATIOn
// =====================================================

$sql = "INSERT INTO application (User_ID, JobOrderID, Application_Status)
        VALUES (?, ?, 'Pending')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $userID, $JobOrderID);
$stmt->execute();

// DECREASE VACANCIES
// =====================================================

// Step 1: Check current vacancies
$vacQuery = "SELECT no_vacancies FROM job_order WHERE JobOrderID = ?";
$stmtVac = $conn->prepare($vacQuery);
$stmtVac->bind_param("i", $JobOrderID);
$stmtVac->execute();
$resultVac = $stmtVac->get_result();
$rowVac = $resultVac->fetch_assoc();

if ($rowVac) {
    $currentVacancies = $rowVac['no_vacancies'];

    if ($currentVacancies > 0) {
        $updateVac = "UPDATE job_order 
                      SET no_vacancies = no_vacancies - 1
                      WHERE JobOrderID = ?";
        $stmtUpdate = $conn->prepare($updateVac);
        $stmtUpdate->bind_param("i", $JobOrderID);
        $stmtUpdate->execute();
    }
}
?>
