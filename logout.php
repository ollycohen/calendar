<?php
session_start();
if(session_destroy()){
    echo json_encode(array(
        "success" => true
	));
	exit;
} else {
    echo json_encode(array(
        "success" => false
	));
}

// return header("Location: http://ec2-3-136-160-212.us-east-2.compute.amazonaws.com/m5/calendar.php");