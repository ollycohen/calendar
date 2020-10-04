<?php
ini_set( 'session.cookie_httponly', 1 );
// Thanks https://classes.engineering.wustl.edu/cse330/index.php?title=AJAX_and_JSON#Logging_In_a_User
// login_ajax.php

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

require 'usersDAO.php';

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username = $json_obj['username'];
$password = $json_obj['password'];

//$username = $POST['username'];
//$password = $POST['password'];

//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

// Filter input by checking regex of username
if (!preg_match('/^[a-z\d_]{3,20}$/i', $username)) {
    // return header("Location: http://ec2-3-136-160-212.us-east-2.compute.amazonaws.com/m3/welcome.php?fail_login=true");
    echo "failure";
 }
 
$usersDAO = new UsersDAO();
if($usersDAO->login($username, $password)){
    session_start();
    $_SESSION['user'] = $username;
    $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 
    $token = $_SESSION['token'];
	echo json_encode(array(
        "success" => true,
        "token" => $token
	));
	exit;
}else{
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password"
	));
	exit;
}
?>