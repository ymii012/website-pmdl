<?php
require 'connect.php';
session_start();

if (!isset($_GET['token'])) {
    die("Invalid activation link.");
}

$token = $_GET['token'];
$token_hash = hash("sha256", $token);

// Find user with this activation token
$sql = "SELECT * FROM register WHERE account_activation_hash = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $token_hash);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Invalid or expired activation token.");
}

$user = $result->fetch_assoc();

// Clear the activation hash = activate account
$update = "UPDATE register SET account_activation_hash = NULL WHERE OFW_ID = ?";
$stmt = $conn->prepare($update);
$stmt->bind_param("i", $user['OFW_ID']);
$stmt->execute();

// Auto-login user after activation
$_SESSION['email']  = $user['Email'];
$_SESSION['OFW_ID'] = $user['OFW_ID'];

header("Location: ../userdash.php?activated=1");
exit();
