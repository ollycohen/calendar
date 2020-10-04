<?php
// Recycled from module 3 news website

class UsersDAO
{
    private $database;

    // Connect to database
    public function __construct()
    {
        // https://classes.engineering.wustl.edu/cse330/index.php?title=PHP_and_MySQL#Connecting_to_a_MySQL_Database_in_PHP
        $this->database = new mysqli('localhost', 'phpuser', 'php', 'calendar');
        if ($this->database->connect_error) {
            die('Connect Error (' . $this->database->connect_errno . ') ' . $this->database->connect_error);
        }
    }

    // Used for log in in welcome.php
    public function login($username, $password)
    {
        if ($stmt = $this->database->prepare("SELECT password FROM users WHERE username = ? ")) {
            $stmt->bind_param('s', $username);
            $stmt->execute();
            $stmt->bind_result($hashed_pass);
            $stmt->fetch();
            $stmt->close();
            return password_verify($password, $hashed_pass);
        }
        printf("Query Prep Failed: %s\n", $this->database->error);
        return false;
    }

    // Function returns search query for name by username
    public function getName($username)
    {
        if ($stmt = $this->database->prepare("SELECT first_name FROM users WHERE username = ? ")) {
            $stmt->bind_param('s', $username);
            $stmt->execute();
            $stmt->bind_result($name);
            return ($name);
            $stmt->close();
        }
        printf("Query Prep Failed: %s\n", $this->database->error);
        return false;
    }

    // Used for sign up in welcome.php
    public function signup($username, $password, $first_name, $last_name)
    {
        $hashed_pw = password_hash($password, PASSWORD_BCRYPT);
        if ($stmt = $this->database->prepare("INSERT INTO users (username, password, first_name, last_name) VALUES ( ? , ? , ?, ?)")) {
            $stmt->bind_param('ssss', $username, $hashed_pw, $first_name, $last_name);
            $success = false;
            if ($stmt->execute()) {
                $success = true;
            }
            $stmt->close();
            return ($success);
        }
        printf("Query Prep Failed: %s\n", $this->database->error);
        return false;
    }
}



?>