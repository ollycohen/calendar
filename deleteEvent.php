<?php

require 'security.php';
require 'eventsDAO.php';

$event_id = $_POST['event_id'];

$eventsDAO = new EventsDAO();
echo $eventsDAO->deleteEvent($event_id, $user);