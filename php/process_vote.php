<?php
	//this page essentially processes the user votes when the vote button has been clicked
	
	//start the session
	session_start();
	//get database info
	require_once('./database.php');
	require('./user_db.php');

	//include TMDb wrapper class
	include('./TMDb.php');
	//create new tmdb object with my API key
	$tmdb = new TMDb('a592c64a025525d496607cdd273be6b3');

	//since the voteID is auto_increment, set the value to default
	$voteID = "DEFAULT";
	//grab the userID from the SESSION
	$userID = $_SESSION['userID'];
	//grab the actorID and movieID from the POST sent via AJAX from test.js
	$actorID = $_POST['actorID'];
	$movieID = $_POST['movieID'];
	//cast these as ints to work with PHP wrapper request
	$aID = (int) $actorID;
	$mID = (int) $movieID;
	
	//get the actor info from TMDb
	$actor = $tmdb->getPerson($aID);
	//set actor image as profile_path
	$profileImg = $actor['profile_path'];
	//grab the biography info from the AJAX post.
	//IMPORTANT to remove any quotes from the data otherwise it will not insert into database
	//spent five hours realizing this
	$actorBio = str_replace('"',' ', $_POST['actorBio']);
	$actorBio2 = str_replace("'",' ', $actorBio);
	//grab the actor name
	$actorName = $actor['name'];

	//grab the poster for the movie
	$movieImg = $_POST['movieImg'];
	//grab movie synopsis and strip of all quotes
	$movieSynopsis = str_replace('"',' ', $_POST['movieSynopsis']);
	$movieSynopsis2 = str_replace("'",' ', $movieSynopsis);

	//function that checks if a user has already voted for this actor
	$voted = check_voted('voteID', 'userID', 'actorID', 'votes', $userID, $actorID);

	//if he or she has voted, simply update the movie info for that actor
	$query1 = "UPDATE votes 
			   SET movieID='$movieID', movieImg='$movieImg', movieSynopsis='$movieSynopsis2'
			   WHERE userID='$userID' AND actorID='$actorID'";

	//if he or she hasn't voted for this actor, insert a new record into the votes table
	$query2 = "INSERT INTO votes (voteID, userID, actorID, movieID, profileImg, actorBio, movieImg, movieSynopsis, actorName)
					VALUES('$voteID', '$userID', '$actorID', '$movieID', '$profileImg', '$actorBio2', '$movieImg', '$movieSynopsis2', '$actorName')";
	
	if ($voted) {
		$db->query($query1);
	}
	else {
		$db->query($query2);
	} 

?>