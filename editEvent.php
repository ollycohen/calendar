<?php

require 'security.php';
require 'eventsDAO.php';

$event_id = $_POST['event_id'];
$title = $_POST['title'];
$color = $_POST['color'];
$time = $_POST['time'];
$date = $_POST['date'];
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
if ($eventsDAO->updateEvent($title, $description, $color, $time, $date, $owners, $event_id, $user)) {
    echo 'success';
} else {
    echo 'failure';
}
