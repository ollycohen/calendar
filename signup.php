<?php
// Thanks https://classes.engineering.wustl.edu/cse330/index.php?title=AJAX_and_JSON#Logging_In_a_User
// login_ajax.php
ini_set( 'session.cookie_httponly', 1 );

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

require 'usersDAO.php';

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$user = $json_obj['username'];
$password = $json_obj['password'];
$first_name = $json_obj['first_name'];
$last_name = $json_obj['last_name'];

// Filter input by checking regex of user signing up
if (!preg_match('/^[a-z\d_]{3,20}$/i', $user)) {
   // return header("Location: http://ec2-3-136-160-212.us-east-2.compute.amazonaws.com/m3/welcome.php?fail_signup=true");
   echo "failure";
   return;
}

$usersDAO = new UsersDAO();
if ($usersDAO->signup($user, $password, $first_name, $last_name)) {
    session_start();
	$_SESSION['user'] = $user;
    $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
    //return header("Location: http://ec2-3-136-160-212.us-east-2.compute.amazonaws.com/m3/news.php");
    echo json_encode(array(
        "success" => true
	));
	exit;
} else {
    echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password"
	));
	exit;
}