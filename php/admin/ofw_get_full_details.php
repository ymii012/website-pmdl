<?php
// php/admin/ofw_get_full_details.php

$host = 'localhost';
$dbname = 'pmdlwebsite'; 
$username = 'root'; 
$password = ''; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die(json_encode(['error' => 'Connection failed: ' . $e->getMessage()]));
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    
    if (empty($id)) {
        echo json_encode(['error' => 'No ID provided']);
        exit;
    }
    
    try {
        // First, let's find the correct table
        $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        
        // Try common table names
        $possibleTables = ['application', 'ofw_table', 'ofw', 'ofws', 'applicants', 'applicant'];
        $tableName = null;
        
        foreach ($possibleTables as $table) {
            if (in_array($table, $tables)) {
                $tableName = $table;
                break;
            }
        }
        
        if (!$tableName) {
            echo json_encode(['error' => 'No suitable table found. Available tables: ' . implode(', ', $tables)]);
            exit;
        }
        
        // Get table structure to verify columns
        $stmt = $pdo->prepare("DESCRIBE $tableName");
        $stmt->execute();
        $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        // Fetch the data
        $stmt = $pdo->prepare("SELECT * FROM $tableName WHERE Ofw_ID = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($data) {
            echo json_encode($data);
        } else {
            echo json_encode(['error' => "No record found with ID: $id in table $tableName"]);
        }
        
    } catch (Exception $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>