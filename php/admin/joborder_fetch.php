<!-- table fetch populating -->
<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "pmdlwebsite";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Failed to connect to DB: " . $conn->connect_error);
}

// Status filter from URL (?status=active / pending / closed / all)
$statusFilter = isset($_GET['status']) ? strtolower($_GET['status']) : "all";


// Map numeric to text
$statusText = [
    1 => "Active",
    2 => "Pending",
    3 => "Closed"
];

// Map URL filter to numeric value
$statusNumberMap = [
    "active"  => 1,
    "pending" => 2,
    "closed"  => 3
];

// If "all" → no filter
if ($statusFilter === "all") {
    $sql = "SELECT * FROM job_order ORDER BY JobOrder_Id DESC";
} else {
    $filterValue = $statusNumberMap[$statusFilter] ?? 1;
    $sql = "SELECT * FROM job_order WHERE status = '$filterValue' ORDER BY JobOrder_Id DESC";
}

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {

    while ($row = $result->fetch_assoc()) {

        // Convert numeric status to readable text
        $statusNum = $row["status"];
        $status = $statusText[$statusNum] ?? "Unknown";

        // CSS Status Colors
        $statusClass = match($statusNum) {
            1 => "status-active",
            2 => "status-pending",
            3 => "status-closed",
            default => "status-unknown"
        };

        // Format date
        $deadline = date('M d, Y', strtotime($row["application_deadline"]));

        // Data for JS modal
        $viewData = [
            "id"             => $row["JobOrder_Id"],
            "position"       => $row["position_title"],
            "company"        => $row["employer_company"],
            "country"        => $row["country"],
            "vacancies"      => $row["no_vacancies"],
            "status"         => $status,
            "deadline"       => $deadline,
            "salary"         => $row["salary"] ?? "",
            "description"    => $row["job_description"] ?? "",
            "contact_person" => $row["contact_person"] ?? "",
            "contact_email"  => $row["contact_email"] ?? "",
            "contact_phone"  => $row["contact_phone"] ?? ""
        ];

        $jsonData = htmlspecialchars(json_encode($viewData), ENT_QUOTES);

        echo "
        <tr>
            <td>{$row["JobOrder_Id"]}</td>
            <td>{$row["position_title"]}</td>
            <td>{$row["employer_company"]}</td>
            <td>{$row["country"]}</td>
            <td>{$row["no_vacancies"]}</td>

            <td><span class='$statusClass'>{$status}</span></td>

            <td>$deadline</td>

            <td>
                <button class='btn-view-job' onclick='viewJob($jsonData)'>
                    <i class=\"fas fa-eye\"></i> View
                </button>
            </td>
        </tr>";
    }

} else {
    echo "<tr><td colspan='8' class='text-center'>No job orders found.</td></tr>";
}

$conn->close();
?>
