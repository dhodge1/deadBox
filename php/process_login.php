<?php
	session_start();
	require_once('./database.php');
	//require my functions file
	require('./user_db.php');
	
	//Intialize the error message as a blank string, get the necessary variables from POST and set up validation with regex
	unset($_SESSION['error']);
	$uName = $_POST['username'];
	$usernameMatch = preg_match('/^[a-zA-Z0-9]{3,30}$/', $uName);
	$uPass = sha1($_POST['password']);
	$passwordMatch = preg_match('/^[a-zA-Z0-9\.-\_]{5,30}$/', $_POST['password']);
	
	//Realized that I do not need the empty checks b/c my regex does not allow empty fields
    if ( $usernameMatch != 1 || $passwordMatch != 1 )  {
        $_SESSION['error'] = "Invalid username or password!!"; }
	
	if (isset($_SESSION['error'])) {
        header("Location: ../index.php");
        exit();
    }
	
	//The following receive a boolean value from the check_valid functions to determine
	//validity of entered fields (i.e. username or password)
	$uvalid = check_valid1('uName', 'users', $uName);
	
	$pvalid = check_valid1('uPass', 'users', $uPass);
	
	$valid = check_valid2('uName', 'uPass', 'users', $uName, $uPass);
    
	//If the credentials are valid, go ahead
	//If neither username and password exist, prompt registration
	//If one or the other is incorrect, display a message as such
	if ($valid) {
		$_SESSION['username'] = $uName;
		$_SESSION['valid'] = 1;
		$uID = get_userID('userID', 'uName', 'users', $uName);
		$_SESSION['userID'] = $uID['userID'];
		header("Location: ../main.php");
		exit();
	} else if (!$uvalid && !$pvalid) {
		$_SESSION['error'] = "Please register your account.";
		header("Location: ../register.php");
		exit();
	} else if (!$uvalid || !$pvalid) {
		$_SESSION['error'] = "Invalid username or password.";
		header("Location: ../index.php");
		exit();
	}

?>
