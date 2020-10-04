<?php
ini_set( 'session.cookie_httponly', 1 );
session_start();

$user_exists = isset($_SESSION["user"]);
$user = "no_user!";

if ($user_exists) {
    $user = $_SESSION["user"];
}

$csrf_safe = true; //isset($_SESSION["token"]) && isset($_POST["token"]) && hash_equals($_SESSION['token'], $_POST['token']);


if (!$user_exists) {
    die("no user");
}

if (!$csrf_safe) {
    die("not csrf safe");
}
