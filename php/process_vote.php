<?php
	session_start();
	require_once('./database.php');
	require('./user_db.php');

	include('./TMDb.php');
	$tmdb = new TMDb('a592c64a025525d496607cdd273be6b3');

	$voteID = "DEFAULT";
	$userID = $_SESSION['userID'];
	$actorID = $_POST['actorID'];
	$movieID = $_POST['movieID'];
	$aID = (int) $actorID;
	$mID = (int) $movieID;
	
	$actor = $tmdb->getPerson($aID);
	$profileImg = $actor['profile_path'];
	//$actorBio = str_replace('"',' ', $actor['biography']);
	$actorBio = str_replace('"',' ', $_POST['actorBio']);
	$actorBio2 = str_replace("'",' ', $actorBio);
	$actorName = $actor['name'];

	//$movie = $tmdb->getMovie($mID);
	//$movieImg = $movie['poster_path'];
	$movieImg = $_POST['movieImg'];
	//$movieSynopsis = $movie['overview'];
	$movieSynopsis = str_replace('"',' ', $_POST['movieSynopsis']);
	$movieSynopsis2 = str_replace("'",' ', $movieSynopsis);

	$voted = check_voted('voteID', 'userID', 'actorID', 'votes', $userID, $actorID);

	$query1 = "UPDATE votes 
			   SET movieID='$movieID', movieImg='$movieImg', movieSynopsis='$movieSynopsis2'
			   WHERE userID='$userID' AND actorID='$actorID'";

	$query2 = "INSERT INTO votes (voteID, userID, actorID, movieID, profileImg, actorBio, movieImg, movieSynopsis, actorName)
					VALUES('$voteID', '$userID', '$actorID', '$movieID', '$profileImg', '$actorBio2', '$movieImg', '$movieSynopsis2', '$actorName')";
	
	if ($voted) {
		$db->query($query1);
	}
	else {
		$db->query($query2);
	} 

?>

<!--<html>
	<head>
		<title>POST Test</title>
	</head>
	<body>
		<?php
			//echo $actorBio;
		?>
	</body>
</html>-->