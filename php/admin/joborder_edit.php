<?php
require_once "../connect.php";

header("Content-Type: application/json");
ob_clean(); // remove any accidental output

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $id = intval($_POST["JobOrder_Id"]);
    $position = $_POST["position_title"];
    $company = $_POST["employer_company"];
    $country = $_POST["country"];
    $salary = $_POST["salary"];
    $vacancies = $_POST["no_vacancies"];
    $deadline = $_POST["application_deadline"];

    // Map status to numeric
    $statusMap = [
        "Active" => 1,
        "Pending" => 2,
        "Closed" => 3
    ];
    $status = $statusMap[$_POST["status"]] ?? 1;

    // Lists
    $requirements = implode("\n", $_POST["requirements"]);
    $benefits = implode("\n", $_POST["benefits"]);

    $description = $_POST["job_description"];
    $contact_person = $_POST["contact_person"];
    $contact_email = $_POST["contact_email"];
    $contact_phone = $_POST["contact_phone"];

    $sql = "UPDATE job_order SET
        position_title=?, employer_company=?, country=?, salary=?,
        no_vacancies=?, application_deadline=?, status=?,
        job_description=?, requirements=?, benefits=?,
        contact_person=?, contact_email=?, contact_phone=?
        WHERE JobOrder_Id=?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "ssssissssssssi",
        $position, $company, $country, $salary,
        $vacancies, $deadline, $status,
        $description, $requirements, $benefits,
        $contact_person, $contact_email, $contact_phone, $id
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    exit;
}
?>
