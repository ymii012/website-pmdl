<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "pmdlwebsite";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Failed to connect to DB: " . $conn->connect_error);
}

// Fetch all OFW records
$sql = "SELECT Ofw_ID, Name, Destination, Position, Status, Last_Updated FROM ofw_records";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {

        // Convert numeric status to text
        switch ($row["Status"]) {
            case 1: $statusText = "Pending"; break;
            case 2: $statusText = "Complete"; break;
            case 3: $statusText = "Incomplete"; break;
            default: $statusText = "Unknown";
        }

        echo "
        <tr>
            <td>" . htmlspecialchars($row["Name"]) . "</td>
            <td>" . htmlspecialchars($row["Destination"]) . "</td>
            <td>" . htmlspecialchars($row["Position"]) . "</td>
            <td>" . $statusText . "</td>
            <td>" . htmlspecialchars($row["Last_Updated"]) . "</td>
            <td class='action'>
                <button 
                    class='btn btn-sm btn-primary viewBtn'
                    data-id='" . htmlspecialchars($row["Ofw_ID"]) . "'
                    data-name='" . htmlspecialchars($row["Name"]) . "'
                    data-destination='" . htmlspecialchars($row["Destination"]) . "'
                    data-position='" . htmlspecialchars($row["Position"]) . "'
                    data-status='" . $statusText . "'
                >
                    View
                </button>
            </td>
        </tr>";
    }
} else {
    echo "<tr><td colspan='6'>No records found.</td></tr>";
}
$conn->close();
?>
