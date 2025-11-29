<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "pmdlwebsite";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) { die("DB Error: " . $conn->connect_error); }

$id = intval($_GET['id']);

$sql = "SELECT * FROM job_order WHERE JobOrder_id = $id LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows == 0) {
    echo "Job not found.";
    exit;
}

$row = $result->fetch_assoc();

// Convert INT status → label
function getStatusLabel($statusInt) {
    switch ($statusInt) {
        case 1: return "Active";
        case 2: return "Pending";
        case 3: return "Closed";
        default: return "Unknown";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title><?php echo $row["position_title"]; ?></title>
    <link rel="stylesheet" href="styles/jobs.css">
</head>
<body>

<div class="job-details-container">
    <h1><?php echo $row["position_title"]; ?></h1>
    <h3><?php echo $row["employer_company"]; ?></h3>
    <p><strong>Location:</strong> <?php echo $row["country"]; ?></p>
    <p><strong>Salary:</strong> <?php echo $row["salary"]; ?></p>
    <p><strong>Vacancies:</strong> <?php echo $row["no_vacancies"]; ?></p>
    <p><strong>Status:</strong> <?php echo $row["status"]; ?></p>

    <h3>Description</h3>
    <p><?php echo nl2br($row["job_description"]); ?></p>

    <h3>Contact</h3>
    <p><strong>Person:</strong> <?php echo $row["contact_person"]; ?></p>
    <p><strong>Email:</strong> <?php echo $row["contact_email"]; ?></p>
    <p><strong>Phone:</strong> <?php echo $row["contact_phone"]; ?></p>

    <br>
    <a href="user-dashboard.php" class="btn">Back</a>
</div>

</body>
</html>