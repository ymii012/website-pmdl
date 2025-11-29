<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "pmdlwebsite";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Failed to connect to DB: " . $conn->connect_error);
}

// Sanitize inputs
$position_title       = $_POST['position_title'];
$employer_company     = $_POST['employer_company'];
$country              = $_POST['country'];
$salary               = $_POST['salary'];
$no_vacancies         = $_POST['no_vacancies'];
$application_deadline = $_POST['application_deadline'];
$job_description      = $_POST['job_description'];
$contact_person       = $_POST['contact_person'];
$contact_email        = $_POST['contact_email'];
$contact_phone        = $_POST['contact_phone'];

// Convert status text -> number
$statusMap = [
    "Active"  => 1,
    "Pending" => 2,
    "Closed"  => 3
];

$status = $statusMap[$_POST['status']] ?? 1;

// Convert arrays to JSON
$requirements = json_encode($_POST['requirements']);
$benefits     = json_encode($_POST['benefits']);

$sql = "INSERT INTO job_order 
(position_title, employer_company, country, salary, 
 no_vacancies, application_deadline, status, job_description, 
 requirements, benefits, contact_person, contact_email, contact_phone)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "sssisssssssss",
    $position_title,
    $employer_company,
    $country,
    $salary,
    $no_vacancies,
    $application_deadline,
    $status,
    $job_description,
    $requirements,
    $benefits,
    $contact_person,
    $contact_email,
    $contact_phone
);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
