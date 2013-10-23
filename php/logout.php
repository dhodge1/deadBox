<?php
	//basic script that is called upon logout to destroy the session and redirect to the splash page
	session_start();
	
	session_destroy();
	$_SESSION = array();
	header("Location: ../index.php");
?>
	