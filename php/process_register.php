<?php
	session_start();
	require_once('./database.php');
	//require('user_db.php');
	
	//Intialize the error message as a blank string, get the necessary variables from POST and set up validation with regex
	unset($_SESSION['error']);
	$id = "DEFAULT";
	$email = $_POST['email'];
	$emailMatch = preg_match('/^[a-zA-Z0-9\.-\_]+@[a-zA-Z0-9\.-\_]+\.[a-z]{2,4}$/', $email);
	$uName = $_POST['username'];
	$usernameMatch = preg_match('/^[a-zA-Z0-9]{3,30}$/', $uName);
	$uPass = sha1($_POST['password']);
	$passwordMatch = preg_match('/^[a-zA-Z0-9\.-\_]{5,30}$/', $_POST['password']);
	
	//Validate username and password with regex,
	//check to ensure proper role is specified
	if ( $emailMatch != 1 )  {
        $_SESSION['error'] = 'Invalid email.'; }
	if ( $usernameMatch != 1 )  {
        $_SESSION['error'] = 'Invalid username.'; }
	if ( $passwordMatch != 1 )  {
        $_SESSION['error'] = 'Invalid password.'; }
		
	//Get a resultset of existing usernames
	$query1 = "SELECT uName FROM users ";
	$nameCheck = $db->query($query1);
	
	//For each row in the set, check to see if the supplied name exists
	foreach ($nameCheck as $name) :
		if ($name['uName'] == $uName) {
			$_SESSION['error'] = ' ' . 'Username already exists.' . ' ';
		}
	endforeach;

    if (isset($_SESSION['error'])) {
        header("Location: ../register.php");
        exit();
    }
	
	//If all checks are passed, insert the details into a temporary table
	//for the IC to approve
	$query = "INSERT INTO users (userID, email, uName, uPass) 
			  VALUES('".$id."','".$email."','".$uName."','".$uPass."')";
    $db->query($query);
	
	header('Location: ../index.php');

?>