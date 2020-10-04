<?php
ini_set( 'session.cookie_httponly', 1 );
session_start();
if(isset($_SESSION{'user'})){
    $username = $_SESSION['user'];
    $token = $_SESSION['token'];
    echo json_encode(array(
        "success" => true,
        "username" => $username,
        "token" => $token
	));
	exit;
} else {
    echo json_encode(array(
		"success" => false,
		"message" => "No session is set"
	));
	exit;
}