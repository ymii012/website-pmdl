<?php 
include 'connect.php';
session_start();

// Make sure the user is logged in and has OFW_ID
if (!isset($_SESSION['OFW_ID'])) {
    die("Error: User not logged in or OFW_ID missing.");
}

$Ofw_ID = $_SESSION['OFW_ID'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // JOB ID OF SELECTED JOB
    $JobOrderID = $_POST['JobOrder_Id'] ?? null;

    if (!$JobOrderID) {
        die("Error: Missing Job Order ID.");
    }

    $LastName    = $_POST['Lname'] ?? '';
    $FirstName   = $_POST['Fname'] ?? '';
    $MidName     = $_POST['Mname'] ?? '';
    $ExtraName   = $_POST['Ename'] ?? '';
    $Sex         = $_POST['sex'] ?? '';
    $civilstatus = $_POST['cvstatus'] ?? '';
    $DateBirth   = $_POST['Dateb'] ?? '';
    $Height      = $_POST['height'] ?? '';
    $Weight      = $_POST['weight'] ?? '';
    $Nationality = $_POST['nationality'] ?? '';
    $BirthPlace  = $_POST['bPlace'] ?? '';
    $religion    = $_POST['Religion'] ?? '';
    $PAddress    = $_POST['pAdress'] ?? '';
    $City        = $_POST['city'] ?? '';
    $Zip         = $_POST['zip'] ?? '';
    $ActNum      = $_POST['activeNum'] ?? '';
    $AEmail      = $_POST['Aemail'] ?? '';

    // APPLICATION DETAILS
    $CountyDeply = $_POST['CountryDeploy'] ?? '';
    $jobType     = $_POST['Jobtype'] ?? '';

    // INSERT INTO APPLICATION 
    $sql = "
        INSERT INTO application
        (Ofw_ID, JobOrder_Id, Last_Name, First_Name, Middle_Name, Extension_Name, Sex, Civil_Status,
         Date_of_Birth, Height, Weight, Nationality, Birth_Place, Religion, Barangay,
         City, Zip_Code, Contact_Num, Email_Address, Country, Job)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        die("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param(
        "iisssssssdssssssissss",
        $Ofw_ID,
        $JobOrderID,
        $LastName,
        $FirstName,
        $MidName,
        $ExtraName,
        $Sex,
        $civilstatus,
        $DateBirth,
        $Height,
        $Weight,
        $Nationality,
        $BirthPlace,
        $religion,
        $PAddress,
        $City,
        $Zip,
        $ActNum,
        $AEmail,
        $CountyDeply,
        $jobType
    );

    // Execute application insert
    if ($stmt->execute()) {

        // ⭐ STEP 3 — DECREMENT VACANCIES
        $updateVacancy = "
            UPDATE job_order
            SET no_vacancies = CASE 
                WHEN no_vacancies > 0 THEN no_vacancies - 1
                ELSE 0
            END
            WHERE JobOrder_Id = ?
        ";

        $stmtVac = $conn->prepare($updateVacancy);
        $stmtVac->bind_param("i", $JobOrderID);
        $stmtVac->execute();
        $stmtVac->close();


        // ⭐⭐⭐ AUTO-CLOSE JOB ORDER WHEN VACANCIES HIT 0 ⭐⭐⭐
        $checkVac = "SELECT no_vacancies FROM job_order WHERE JobOrder_Id = ?";
        $stmtCheck = $conn->prepare($checkVac);
        $stmtCheck->bind_param("i", $JobOrderID);
        $stmtCheck->execute();
        $resultCheck = $stmtCheck->get_result();
        $rowCheck = $resultCheck->fetch_assoc();
        $stmtCheck->close();

        if ($rowCheck && (int)$rowCheck['no_vacancies'] === 0) {

            // Set status = 3 (Closed)
            $closeQuery = "UPDATE job_order SET status = 3 WHERE JobOrder_Id = ?";
            $stmtClose = $conn->prepare($closeQuery);
            $stmtClose->bind_param("i", $JobOrderID);
            $stmtClose->execute();
            $stmtClose->close();
        }
        // ⭐ END OF AUTO-CLOSE LOGIC ⭐


        // ---------------------------------------------
        // UPDATE OFW RECORDS (selected summary data)
        // ---------------------------------------------

        // Create full name
        $FullName = trim("$FirstName $LastName " . ($MidName ? "$MidName " : "") . ($ExtraName ? "$ExtraName" : ""));

        // Check if record exists
        $checkSql = "SELECT Ofw_ID FROM ofw_records WHERE Ofw_ID = ?";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bind_param("i", $Ofw_ID);
        $checkStmt->execute();
        $checkStmt->store_result();

        if ($checkStmt->num_rows > 0) {

            $sql2 = "
                UPDATE ofw_records 
                SET Name = ?, Destination = ?, Position = ?, Last_Updated = CURRENT_TIMESTAMP
                WHERE Ofw_ID = ?
            ";

            $stmt2 = $conn->prepare($sql2);
            $stmt2->bind_param("sssi", $FullName, $CountyDeply, $jobType, $Ofw_ID);
            $stmt2->execute();
            $stmt2->close();
        } else {

            $sql2 = "
                INSERT INTO ofw_records (Ofw_ID, Name, Destination, Position, Status, Last_Updated)
                VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
            ";

            $stmt2 = $conn->prepare($sql2);
            $stmt2->bind_param("isss", $Ofw_ID, $FullName, $CountyDeply, $jobType);
            $stmt2->execute();
            $stmt2->close();
        }

        $checkStmt->close();

        // Redirect on success
        header("Location: ../submission.php?jobid=$JobOrderID");
        exit();
        
    } else {
        echo "Database Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
