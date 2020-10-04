<? require 'checkSession.php' ?>

<!DOCTYPE html>
<html lang="en">
<head>


    <meta charset="utf-8">
    <link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/start/jquery-ui.css" type="text/css"
        rel="Stylesheet" />
    <!-- <script src="https://code.jquery.com/jquery-3.4.1.min.js"
        integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script> -->
    
    <!-- Google JQuery Library-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
        integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="calendar.css">

    <script src="cal.js"></script>
    <title>Trozanne Calendar</title> 
</head>

<body>

</body>
<div class="container">
    <br>
    <div class="user-container">
       <div id="login"></div>
        <p id="login-result"></p>
    </div>
    <div class="row">
        <div class = column id="calendar">
    </div>
</div>
<br>
<div class="container" id="month-btns">
    <div class = "row">
        <div class = "col">
            <button type="button" class = "btn btn-secondary" id="prev-month-btn"> Previous Month </Button>
            <button type="button" class = "btn btn-secondary" id="next-month-btn"> Next Month </Button>
        </div>
    </div>
</div>
<br>
<br>
<div class = "container" id="action-area">
</div>
<footer>
   
</footer>

</html>