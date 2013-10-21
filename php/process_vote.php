<?php
	session_start();
	require_once('./database.php');
	require('./user_db.php');

	$voteID = "DEFAULT";
	$userID = $_SESSION['userID'];
	$actorID = $_POST['actorID'];
	$movieID = $_POST['movieID'];

	$voted = check_voted('voteID', 'userID', 'actorID', 'votes', $userID, $actorID);

	$query1 = "UPDATE votes 
			   SET movieID='$movieID'
			   WHERE userID='$userID' AND actorID='$actorID'";

	$query2 = "INSERT INTO votes
					VALUES('$voteID', '$userID', '$actorID', '$movieID')";
	
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
			//echo $userID . ",actorID: " . $actorID . ",movieID: ". $movieID;
		?>
	</body>
</html>-->