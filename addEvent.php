<?php

require 'security.php';
require 'eventsDAO.php';

$title = $_POST['title'];
$color = $_POST['color'];
$time = $_POST['time'];
$date = $_POST['date'];
$month = $_POST['month'];
$year = $_POST['year'];
$description = "";
if (isset($_POST['description'])) {
    $description = $_POST['description'];
}


$owners = [];
if (isset($_POST['owners'])) {
    $owners_string = $_POST['owners'];
    $owners = preg_split ("/\, | |,|; |;/", $owners_string);
}

// The user is always an owner.
array_push($owners, $user);

$eventsDAO = new EventsDAO();
if ($eventsDAO->postEvent($title, $description, $color, $time, $date, $month, $year, $owners)) {
    echo 'success';
} else {
    echo 'failure';
}
