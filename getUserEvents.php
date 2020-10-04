<?php

require 'security.php';
require 'eventsDAO.php';

$date = $_POST['date'];
$month = $_POST['month'];
$year = $_POST['year'];

$eventsDAO = new EventsDAO();
echo $eventsDAO->getUserEvents($user, $date, $month, $year);
   