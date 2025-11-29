<?php
include 'connect.php';

// ---------- ADMIN ACCOUNT DETAILS ----------
$email = "admin@pmdl.com";     
$plainPassword = "admin123";   

// ---------- HASH THE PASSWORD ----------
$hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);

// ---------- CHECK IF ADMIN ALREADY EXISTS ----------
$checkAdmin = "SELECT * FROM admin WHERE email = ?";
$stmt = $conn->prepare($checkAdmin);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo "Admin with this email already exists: " . $email;
    exit();
}

// ---------- INSERT NEW ADMIN ----------
$sql = "INSERT INTO admin (email, Password, created_at) VALUES (?, ?, NOW())";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $hashedPassword);

if ($stmt->execute()) {
    echo "<h3>✅ Admin account created successfully!</h3>";
    echo "<p><strong>Email:</strong> $email</p>";
    echo "<p><strong>Password:</strong> $plainPassword</p>";
    echo "<p><strong>Hashed Password:</strong> $hashedPassword</p>";
    echo "<p>You can now log in using this email and password.</p>";
} else {
    echo " Error creating admin: " . $conn->error;
}

$stmt->close();
$conn->close();
?>
