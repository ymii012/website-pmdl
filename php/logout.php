<?php
session_start();
session_unset();
session_destroy();
header("Location: /PMDL-PROJECT/home.php");
exit();
?>