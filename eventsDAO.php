<?php

// require_once 'commentsDAO.php';
class EventsDAO
{
    private $database;

    public function __construct()
    {
        $this->database = new mysqli('localhost', 'phpuser', 'php', 'calendar');
        if ($this->database->connect_error) {
            die('Connect Error (' . $this->database->connect_errno . ') ' . $this->database->connect_error);
        }
    }

    // adds an event to the events table, then links that to a user in the owners table.
    public function postEvent($title, $description, $color, $time, $day, $month, $year, $owners)
    {
        $event_id = -1;
        if (strlen($month) == 1) {
            $month = '0'.$month;
        }
        if (strlen($day) == 1) {
            $day = '0'.$day;
        }
        $timestring = $year.'-'.$month.'-'.$day.' '.$time.':00';
        if ($stmt1 = $this->database->prepare("INSERT INTO events (title, description, color, event_time) VALUES (?,?,?,?)")) {
            $stmt1->bind_param('ssss', $title, $description, $color, $timestring);
            if (!$stmt1->execute()) {
                return false;
            }
            $event_id = $stmt1->insert_id;
            $stmt1->close();
        } else {
            printf("Query Prep Failed: %s\n", $this->database->error);
            return false;
        }
        foreach($owners as &$username) {
            if ($username == "" || $username == " ") {continue;}
            if ($stmt2 = $this->database->prepare("INSERT INTO owners (username, event_id) VALUES (?,?)")) {
                $stmt2->bind_param('si', $username, $event_id);
                if (!$stmt2->execute()) {
                    return false;
                }
                $stmt2->close();
            } else {
                printf("Query Prep Failed: %s\n", $this->database->error);
                return false;
            }
        }
        return true;
    }

    // here we go
    public function getUserEvents($user, $day, $month, $year)
    {
        if (strlen($month) == 1) {
            $month = '0'.$month;
        }
        if (strlen($day) == 1) {
            $day = '0'.$day;
        }
        $time_min = $year.'-'.$month.'-'.$day.' 00:00:00';
        $time_max = $year.'-'.$month.'-'.$day.' 23:59:59';

        // https://classes.engineering.wustl.edu/cse330/index.php?title=PHP_and_MySQL
        $events = $this->database->prepare("select events.event_id, title, description, color, DATE_FORMAT( `event_time` , '%H:%i' ) as event_time from events join owners on (events.event_id = owners.event_id) where (owners.username = ? AND event_time >= ? AND event_time <= ?) order by event_time asc");
        if (!$events) {
            printf("Query Prep Failed: %s\n", $this->database->error);
            exit;
        }

        $events->bind_param('sss', $user, $time_min, $time_max);
        
        $events->execute();

        $result = $events->get_result();

        $arr = array();

        while ($row = $result->fetch_assoc()) {
            array_push($arr, $row);
        }
        return json_encode($arr);
    }

    public function getNumEvents($user, $day, $month, $year) {
        if (strlen($month) == 1) {
            $month = '0'.$month;
        }
        if (strlen($day) == 1) {
            $day = '0'.$day;
        }
        $time_min = $year.'-'.$month.'-'.$day.' 00:00:00';
        $time_max = $year.'-'.$month.'-'.$day.' 23:59:59';

        // https://classes.engineering.wustl.edu/cse330/index.php?title=PHP_and_MySQL
        $events = $this->database->prepare("SELECT COUNT(*) as num_events from events join owners on (events.event_id = owners.event_id) where (owners.username = ? AND event_time >= ? AND event_time <= ?)");
        if (!$events) {
            printf("Query Prep Failed: %s\n", $this->database->error);
            exit;
        }

        $events->bind_param('sss', $user, $time_min, $time_max);
        
        $events->execute();

        $result = $events->get_result();
        return mysqli_fetch_array($result)['num_events'];
    }

    public function updateEvent($title, $description, $color, $time, $date, $owners, $event_id, $user) {
        $events = $this->database->prepare("SELECT COUNT(*) as num_events from events join owners on (events.event_id = owners.event_id) where (owners.username = ? AND events.event_id = ?)");
        if (!$events) {
            printf("Query Prep Failed: %s\n", $this->database->error);
            exit;
        }
        $events->bind_param('ss', $user, $event_id);
        
        $events->execute();

        $result = $events->get_result();
        if (strval(mysqli_fetch_array($result)['num_events']) == "1") {
            self::deleteEvent($event_id, $user);
            $year = substr($date, 0, 4);
            $month = substr($date, 5, 7);
            $datestring = substr($date, 8, 10);
            self::postEvent($title, $description, $color, $time, $datestring, $month, $year, $owners);
            return true;
        } else {
            return false;
        }
    }

    public function deleteEvent($event_id, $user) {
        if ($stmt1 = $this->database->prepare("DELETE events FROM events join owners on (events.event_id = owners.event_id) where owners.username = ? and events.event_id = ?")) {
            $stmt1->bind_param('ss', $user, $event_id);
            if (!$stmt1->execute()) {
                return "failure";
            }
            $stmt1->close();
            return "success";
        } else {
            return "Query Prep Failed: ".$this->database->error;
        }
    }
}