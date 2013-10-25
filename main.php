<?php
	session_start();						//start session and if valid isn't set then redirect to the splash page
	if ($_SESSION['valid'] != 1) {
		header("Location: ./index.php");
	}

	//require necessary files to connect to database
	require_once('./php/database.php');
	//require databse functions file
	require('./php/user_db.php');

	//grab the userID from the current session
	$userID = $_SESSION['userID'];
	//call get_actors() which queries the database for the actors that the user has voted for
	$actors = get_actors('actorID', 'profileImg', 'actorBio', 'actorName', 'votes', 'userID', $userID);
	//query the database for the top voted movie (stopping point) for each actor aggregated for all users
	$votes = get_topVotes();
	//count created to add bootstrap rows every four actors
	$count = 0;
	
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
	<?php
		flush();
	?>
	<body class="main">
		<div class="navbar navbar-fixed-top">
			<div class="container">
				<div class="navbar-header">
          			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
			            <span class="icon-bar"></span>
			            <span class="icon-bar"></span>
			            <span class="icon-bar"></span>
          			</button>
          			<a href="http://ps11.pstcc.edu/~c2230a11/site/main.php" class="navbar-brand">deadBox</a>
          		</div>
          		<div class="navbar-collapse collapse">
          			<form class="navbar-form navbar-left" id="form1" role="search">
				      <div class="form-group">
				        <input type="text" class="form-control search" id="text1" placeholder="Search" value="">
				        <button type="button" class="btn searchButton" id="button1"><span class="glyphicon glyphicon-search searchIcon"></span>
				    	</button>
				      </div>
				      <!--<button type="submit" class="btn btn-default">Submit</button>-->
				    </form>
          			<ul class="nav navbar-nav navbar-right">
				      <li class="dropdown">
				        <a href="#" class="dropdown-toggle" data-toggle="dropdown">Hello, <?php echo $_SESSION['username']; ?> <span class="glyphicon glyphicon-cog drop"></span></a>
				        <ul class="dropdown-menu">
				          <!--<li><a href="#">Profile</a></li>-->
				          <!--<li><a href="#">Settings</a></li>-->
				          <li><a href="http://ps11.pstcc.edu/~c2230a11/feeds/">News</a></li>
				          <li>
				          		<form action="./php/logout.php" method="post">
				          			<button type="submit" class="btn logOutButton"><a class="logOut" href="http://ps11.pstcc.edu/~c2230a11/site/index.php">Sign Out</a></button>
				          		</form>
				          </li>
				        </ul>
				      </li>
				    </ul>
          		</div>
			</div>
		</div>
		<section class="content">
			<div class="container" id="content">
				<?php 
					if ($actors->num_rows == 0) {
						echo '<h2>Go forth and search to vote!</h2>';       //if the user hasn't voted for any actors yet, tell them to do so
					}
				?>
				<?php foreach ($actors as $actor) : ?>						
					<?php 
						//for every actor that the user has voted for, check against the top votes.
						//if the actorID from top votes matches the current actor, pull in the information for the top voted movie													
						foreach ($votes as $vote) {
							if ($vote['aID'] == $actor['actorID']) {
								$topMovie = $vote['topMovie'];
								$movieImg = $vote['movieImg'];
								$movieSynopsis = $vote['movieSynopsis'];
							}
						}
						//every four actors insert a new row
						if (($count == 0) || ($count % 4 == 0)) {
							echo '<div class="row featurette"></div>';
						}
						//increment the count
						$count++;
						//flush the buffer contents (a silly optimization)
						flush();
					?>
					<div class="col-lg-3 col-sm-3 col-md-3 col-xs-6">
			          	<!--this is bad practice. store the necessary information in unrelated html attributes. this is a crazy hack. don't do this.-->
			          	<a href="#" class="actorButton tada">
			          		<img class="featurette-image img-responsive actor" id="<?php echo $actor['actorID']; ?>" src="http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w500<?php echo $actor['profileImg']; ?>" data-src="holder.js/500x500/auto" alt="<?php echo $actor['actorName']; ?>" name="<?php echo $actor['actorBio']; ?>" width="http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w500<?php echo $movieImg?>" usemap="<?php echo $movieSynopsis?>">
			          		<p class="actorName text-center"><?php echo $actor['actorName']; ?></p>
			          	</a>
			        </div>
				<?php endforeach; ?>
			</div>	
		</section>	
		<!-- Modal -->
		  <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		    <div class="modal-dialog">
		      <div class="modal-content">
		        <div class="modal-header">
		          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		          <h2 class="modal-title text-center">Vote or die!</h2>
		        </div>
		        <div class="modal-body">
		          <div class="container text-center">
		          	<h3>Would you like to vote for this movie?</h3>
					<img class="featurette-image img-responsive voteImg" id="voteImg" src="" data-src="holder.js/25%x25%/auto" alt="Generic placeholder image">
		          </div>
		        </div>
		        <div class="modal-footer">
			        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
			        <button type="button" class="btn btn-primary vote" id="vote"><a href="./main.php">Vote!</a></button>
		        </div>
		      </div><!-- /.modal-content -->
		    </div><!-- /.modal-dialog -->
		  </div><!-- /.modal -->
		<script src="http://code.jquery.com/jquery.js"></script>
		<script src="./js/bootstrap.js"></script>
		<script src="./js/typeahead.js"></script>
		<script src="./js/test.js"></script>
	</body>
</html>
