<?php
	session_start();
	$_SESSION['valid'] = 0;
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
	<body>
		<div class="navbar navbar-fixed-top">
			<div class="container">
				<div class="navbar-header">
          			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
			            <span class="icon-bar"></span>
			            <span class="icon-bar"></span>
			            <span class="icon-bar"></span>
          			</button>
          			<a href="http://ps11.pstcc.edu/~c2230a11/site/" class="navbar-brand">deadBox</a>
          		</div>
          		<div class="navbar-collapse collapse">
          			<form id="logForm" class="navbar-form navbar-right" action="http://ps11.pstcc.edu/~c2230a11/site/php/process_login.php" method="post">
          				<div class="form-group">
          					<?php
								show_error();
							?>
          				</div>
          				<div class="form-group">
          					<input type="text" placeholder="Username" class="form-control" name="username" required>
			              	<!--<input type="email" placeholder="Email" class="form-control" required>-->
			            </div>
			            <div class="form-group">
			              <input type="password" placeholder="Password" class="form-control" name="password" required>
			              <!--<input type="password" placeholder="Password" class="form-control" required>-->
			            </div>
			            <button type="submit" class="btn btn-success">Sign in</button>
          			</form>
          		</div>
			</div>
		</div>

		<div class="jumbotron text-center">
			<div class="container">
				<h1>Did you hate...</h1>
        		<p class="lead">
        			Al Pacino in <i>Jack and Jill</i>? Jeff Bridges in <i>RIPD</i>? John Voight in <i>SuperBabies: Baby Geniuses 2</i>!?...Great actors, god-awful films. They should've quit before they tore apart the fabric of space and time. Do you wish you had a place to impose your obviously correct opinion upon the rest of the world? deadBox, where careers go to die!
        		</p>
        		<p><a class="btn btn-lg btn-success" href="./register.php">Register now!</a></p>
			</div>
		</div>

		<section class="highlights">
			<div class="container text-center">
				<h2 class="highText">Your place for trolling and fighting with friends.</h2>
				<div class="row">
					<div class="col-lg-4">
						<span class="glyphicon glyphicon-search"></span>
						<h3>Search</h3>
						<p>Tap into TMDB to search for your favorite actors & actresses.</p>
					</div>
					<div class="col-lg-4">
						<span class="glyphicon glyphicon-thumbs-up"></span>
						<h3>Vote</h3>
						<p>Let the world know how much was too much.</p>
					</div>
					<div class="col-lg-4">
						<span class="glyphicon glyphicon-warning-sign"></span>
						<h3>Argue</h3>
						<p>See what other people think and tell them why they're wrong!</p>
					</div>
				</div>
			</div>
		</section>
		<hr>
		<section class="forrest">
			<div class="container">
			<!--<div class="text-center">
				<h1 id="top" class="text-center clearfix">Dynamic content via TMDb search.</h1>
				<h1 id="right" class="pull-right clearfix">Read, watch, play.</h1>
				<h1 id="left" class="pull-left clearfix">Access actor credits.</h1>
				<div class="container pic">-->
					<img src="./img/deadComp1.png" alt="comp" id="comp" class="img-responsive ui">
				<!--</div>-->
			</div>
		</section>
		<section class="quotes">
			<div class="container text-center">
				<h2 class="quoteText">Your opinion, best opinion.</h2>
				<div class="row">
					<div class="col-lg-6">
						<img class="quotePic" src="./img/reporter.jpg" alt="reporter">
						<p class="quote1">"Gary Oldman has never been in a bad movie!"</p>
      						<span>-- <strong class="highQuote">Obnoxious reporter</strong>,<cite> pretentious magazine</cite></span>
					</div>
					<div class="col-lg-6">
						<img class="quotePic" src="./img/hipster.jpg" alt="hipster">
						<p class="quote1">"If Carrot Top had never been born the world would be a better place..." </p>
							<span>-- <strong class="highQuote">Not Carrot Top</strong>,<cite> hipster-blog.com</cite></span>
					</div>
				</div>
			</div>
		</section>
		<footer class="text-center">
			&copy; someone who will probably get sued 2013
		</footer>
		<script src="http://code.jquery.com/jquery.js"></script>
		<script src="./js/splashValidation.js"></script>
		<script src="./js/bootstrap.js"></script>
	</body>
</html>
