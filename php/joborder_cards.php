<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "pmdlwebsite";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) { 
    die("DB Error: " . $conn->connect_error); 
}

// Convert INT status → readable text
function getStatusLabel($statusInt) {
    switch ($statusInt) {
        case 1: return "active";
        case 2: return "pending approval";
        case 3: return "closed";
        default: return "unknown";
    }
}

// Only show ACTIVE jobs
$sql = "SELECT * FROM job_order WHERE status = 1 ORDER BY JobOrder_id DESC";
$result = $conn->query($sql);

echo '<div class="job-cards">';

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {

        $deadline = date('M d, Y', strtotime($row["application_deadline"]));
        $statusLabel = getStatusLabel($row["status"]);
        $salary = $row["salary"] ? htmlspecialchars($row["salary"]) : "Not Specified";

        echo '
        <div class="job-card">
            <h3>' . htmlspecialchars($row["position_title"]) . '</h3>
            <p>' . htmlspecialchars($row["employer_company"]) . '</p>
            <p>📍 ' . htmlspecialchars($row["country"]) . '</p>

            <p>🗓 Until ' . $deadline . '</p>

            <button 
                class="btn view-details-btn"
                data-id="' . $row['JobOrder_Id'] . '"
                data-title="' . htmlspecialchars($row['position_title']) . '"
                data-employer="' . htmlspecialchars($row['employer_company']) . '"
                data-location="' . htmlspecialchars($row['country']) . '"
                data-deadline="' . $deadline . '"
                data-salary="' . $salary . '"
            >
                View Details
            </button>
        </div>';
    }
} else {
    echo "<p>No active job postings available.</p>";
}

echo '</div>';

$conn->close();
?>
