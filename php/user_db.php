<?php
//require_once('./database.php');
$host = 'localhost';
$dbname='c2230a11test';
$username = 'c2230a11';
$password = 'c2230a11';

$db = new mysqli($host, $username, $password, $dbname);
if (mysqli_connect_errno()) {
    include('./database_error.php');
    exit();
}

function check_valid1($col, $tab, $par) {
	global $db;
	$q = "SELECT $col
		  FROM $tab
		  WHERE $col = '$par'";
	$validate1 = $db->query($q);
	$valid1 = ($validate1->num_rows == 1);
	return $valid1;
}

function check_valid2($col1, $col2, $tab, $par1, $par2) {
	global $db;
	$q2 = "SELECT $col1
		  FROM $tab
		  WHERE $col1 = '$par1' AND $col2 = '$par2'";
	$validate2 = $db->query($q2);
	$valid2 = ($validate2->num_rows == 1);
	return $valid2;
}

function check_voted($vID, $uID, $aID, $table, $par1, $par2) {
	global $db;
	$q3 = "SELECT $vID
		  FROM $table
		  WHERE $uID = '$par1' AND $aID = '$par2'";
	$validate3 = $db->query($q3);
	$valid3 = ($validate3->num_rows >= 1);
	return $valid3;
}

function get_userID($col1, $col2, $tab, $par) {
	global $db;
	$q4 = "SELECT $col1
		  FROM $tab
		  WHERE $col2 = '$par'";
	$userSet = $db->query($q4);
	$userID = $userSet->fetch_assoc();
	return $userID;
}

function get_actors($aID, $table, $uID, $par) {
	global $db;
	$q5 = "SELECT $aID
		  FROM $table
		  WHERE $uID = '$par'";
	$actors = $db->query($q5);
	return $actors;
}

function get_topVotes() {
	global $db;
	$q6 = "select actorID as aID, (select movieID from votes where actorID=aID group by userID order by count(*) DESC limit 0,1) as topMovie from votes group by actorID";
	$topVotes = $db->query($q6);
	return $topVotes;
}
	
?>