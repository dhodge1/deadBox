<?php
	session_start();
	require('./php/error_function.php');
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
    	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    	<title>deadBox</title>
    	<link rel="shortcut icon" href="./img/favicon.ico">
		<link rel="stylesheet" href="./css/bootstrap.css">
		<link rel="stylesheet" href="./css/style.css">
	</head>
	<body class="login signup">
		<div class="container col-lg-6-offset-4">
			<div id="login">
			    <h3 class="up">Sign up for deadBox</h3>
			    <hr class="upLine">

			    <?php
						show_error();
				?>

			    <form id="logForm" role="form" action="./php/process_register.php" method="post">
			    	<div class="form-group">
				    	<label for="email">E-mail:</label>
				    	<div class="col-lg-4-offset-4">
				    		<input type="email" class="form-control rText" id="email" name="email" placeholder="Enter email" required>
				    	</div>
			    	</div>
			    	<div class="form-group">
				    	<label for="name">Username:</label>
				    	<div class="col-lg-4-offset-4">
				    		<input type="text" class="form-control rText" id="name" name="username" placeholder="Enter name" required>
				    	</div>
			    	</div>
			    	<div class="form-group">
				    	<label for="password">Password:</label>
				    	<div class="col-lg-4-offset-4">
				    		<input type="password" class="form-control rText" id="password" name="password" placeholder="Enter password" required>
				    	</div>
			    	</div>
			    	<p>
			    		<input class="btn btn-primary" type="submit" value="Sign Up">
			    	</p>
			    </form>
			</div>
		</div>
		<p class="small text-center"><a class="up" href="./index.php">Already have an account? Log in</a></p>
		<script src="http://code.jquery.com/jquery.js"></script>
		<script src="./js/splashValidation.js"></script>
		<script src="./js/bootstrap.js"></script>
	</body>
</html>