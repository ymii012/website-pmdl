<?php
include 'connect.php';
session_start();

/* --------------------------------------------
   REGISTER
---------------------------------------------*/
if (isset($_POST['register'])) {

    $lastName  = trim($_POST['lname']);
    $firstName = trim($_POST['fname']);
    $midName   = trim($_POST['mname']);
    $birthday  = $_POST['bday'];
    $email     = trim($_POST['email']);
    $password  = $_POST['password'];
    $confirm   = $_POST['confirm_password'];

    // Empty fields
    if (
        empty($lastName) || empty($firstName) || empty($midName) ||
        empty($birthday) || empty($email) || empty($password) || empty($confirm)
    ) {
        header("Location: ../registerlog.php?error=emptyfields");
        exit();
    }

    // Valid email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: ../registerlog.php?error=invalidemail");
        exit();
    }

    // Strong password
    if (strlen($password) < 8 ||
        !preg_match("/[a-z]/i", $password) ||
        !preg_match("/[0-9]/", $password)) {

        header("Location: ../registerlog.php?error=weakpassword");
        exit();
    }

    // Confirm password
    if ($password !== $confirm) {
        header("Location: ../registerlog.php?error=passwordmismatch");
        exit();
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Create activation token
    $activation_token = bin2hex(random_bytes(16));
    $activation_hash  = hash("sha256", $activation_token);

    // Check admin email
    $stmtA = $conn->prepare("SELECT 1 FROM admin WHERE email = ?");
    $stmtA->bind_param("s", $email);
    $stmtA->execute();
    if ($stmtA->get_result()->num_rows > 0) {
        header("Location: ../registerlog.php?error=adminexists");
        exit();
    }

    // Check normal user email
    $stmtU = $conn->prepare("SELECT 1 FROM register WHERE Email = ?");
    $stmtU->bind_param("s", $email);
    $stmtU->execute();
    if ($stmtU->get_result()->num_rows > 0) {
        header("Location: ../registerlog.php?error=emailexists");
        exit();
    }

    // Insert new user
    $insert = "
        INSERT INTO register 
        (Last_Name, First_Name, Middle_Name, Birthday, Email, Password, account_activation_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ";

    $stmt = $conn->prepare($insert);
    $stmt->bind_param(
        "sssssss",
        $lastName,
        $firstName,
        $midName,
        $birthday,
        $email,
        $hashedPassword,
        $activation_hash
    );

    if (!$stmt->execute()) {
        die("DB ERROR: " . $stmt->error);
    }

    // Send activation email
    $mail = require __DIR__ . "/mailer.php";

    $mail->setFrom("pmdlwebsitexx@gmail.com", "PMDL Support");
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = "Account Activation";

    $activation_link = "http://localhost/PMDL-Project/php/activate-account.php?token=$activation_token";

    $mail->Body = "
        <h2>Account Activation</h2>
        <p>Click to activate your account:</p>
        <a href='$activation_link'>$activation_link</a>
    ";

    if (!$mail->send()) {
        die("MAIL FAILED: " . $mail->ErrorInfo);
    }

    header("Location: ../registerlog.php?success=activation_sent");
    exit();
}



/* --------------------------------------------
   LOGIN
---------------------------------------------*/
if (isset($_POST['login'])) {

    $email    = $_POST['email'];
    $password = $_POST['password'];

    /* Admin login */
    $stmtA = $conn->prepare("SELECT * FROM admin WHERE email = ?");
    $stmtA->bind_param("s", $email);
    $stmtA->execute();
    $adminResult = $stmtA->get_result();

    if ($adminResult->num_rows > 0) {
        $adminRow = $adminResult->fetch_assoc();

        if (password_verify($password, $adminRow['Password'])) {
            $_SESSION['admin_email'] = $adminRow['email'];
            header("Location: ../admin.php");
            exit();
        } else {
            header("Location: ../registerlog.php?error=wrongpass");
            exit();
        }
    }

    /* User login */
    $stmtU = $conn->prepare("SELECT * FROM register WHERE Email = ?");
    $stmtU->bind_param("s", $email);
    $stmtU->execute();
    $userResult = $stmtU->get_result();

    if ($userResult->num_rows == 0) {
        header("Location: ../registerlog.php?error=noemail");
        exit();
    }

    $userRow = $userResult->fetch_assoc();

    // Check if NOT activated
    if (!empty($userRow['account_activation_hash'])) {
        header("Location: ../registerlog.php?error=notactivated");
        exit();
    }

    // Password match
    if (password_verify($password, $userRow['Password'])) {

        $_SESSION['email']  = $userRow['Email'];
        $_SESSION['OFW_ID'] = $userRow['OFW_ID'];

        header("Location: ../userdash.php");
        exit();

    } else {
        header("Location: ../registerlog.php?error=wrongpass");
        exit();
    }
}
