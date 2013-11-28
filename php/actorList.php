<?php

$data = $_POST['nameSet'];
$data = explode(',', $data);

$response = array();
$names = array();

for($i = 0; $i < $data.length; $i++) {
	$names[] = array('name' => $data[$i]);
}

$response['name'] = $names;

$fp = fopen('results.json', 'w');
fwrite($fp, json_encode($response));
fclose($fp);

?>