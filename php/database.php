<?php
    //simple script that connects to the database and spits out an error if it can't connect
    $host = 'localhost';
    $dbname='c2230a11test';
    $username = 'c2230a11';
    $password = 'c2230a11';

    $db = new mysqli($host, $username, $password, $dbname);
    if (mysqli_connect_errno()) {
        include('./database_error.php');
        exit();
    }
?>
