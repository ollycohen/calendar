(function () { Date.prototype.deltaDays = function (c) { return new Date(this.getFullYear(), this.getMonth(), this.getDate() + c) }; Date.prototype.getSunday = function () { return this.deltaDays(-1 * this.getDay()) } })();
function Week(c) { this.sunday = c.getSunday(); this.nextWeek = function () { return new Week(this.sunday.deltaDays(7)) }; this.prevWeek = function () { return new Week(this.sunday.deltaDays(-7)) }; this.contains = function (b) { return this.sunday.valueOf() === b.getSunday().valueOf() }; this.getDates = function () { for (var b = [], a = 0; 7 > a; a++)b.push(this.sunday.deltaDays(a)); return b } }
function Month(c, b) { this.year = c; this.month = b; this.nextMonth = function () { return new Month(c + Math.floor((b + 1) / 12), (b + 1) % 12) }; this.prevMonth = function () { return new Month(c + Math.floor((b - 1) / 12), (b + 11) % 12) }; this.getDateObject = function (a) { return new Date(this.year, this.month, a) }; this.getWeeks = function () { var a = this.getDateObject(1), b = this.nextMonth().getDateObject(0), c = [], a = new Week(a); for (c.push(a); !a.contains(b);)a = a.nextWeek(), c.push(a); return c } };

// Stackoverflow credit: https://stackoverflow.com/questions/1643320/get-month-name-from-date
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const currentDate = new Date();
const calWidth = 7;
//const username = "This Could Be Your";
const realMonth = new Month(currentDate.getFullYear(), currentDate.getMonth());
let currentMonth = new Month(currentDate.getFullYear(), currentDate.getMonth());
let loggedin = false;
let token;
let username;

$(document).ready(function () {

    function checkSession(){
        fetch('http://ec2-3-136-160-212.us-east-2.compute.amazonaws.com/m5-olly/checkSession.php')
        .then((response) => { return response.json();})
        .then((data) => data.success ? updateHTMLOnLogin(data.success, data.username, data.message, data.token) : console.log("not logged in"))
        .then(console.log("checking the session"))
        .catch(error => console.error('Error:', error));
    }

    checkSession();
    // Credit to CSE 330
    $("#next-month-btn").click(function () {
        currentMonth = currentMonth.nextMonth();
        resetCal();
    });
    $("#prev-month-btn").click(function () {
        currentMonth = currentMonth.prevMonth();
        resetCal();
    });


    $("#login").html(`<input class="login" type="text" name="username" placeholder="Username" id="username">
    <input class="login" type="password" name="password" placeholder="Password" id="password">
    <input class="login" type="submit" value="Log In" id="login-submit"> New User? 
    <input type="button" value="Register" id="register">
    <input id="csrf-token" type="hidden">
    <div class = 'row'><div class = 'col' id = 'name'><h3 id='username-label'> This Could Be Your Calendar</h3></div></div>`);
    
    document.getElementById("register").addEventListener("click", displaySignUpHTML, false); 
    document.getElementById("login-submit").addEventListener("click", loginAjax, false); 
    

    const resetCal = () => {

        let weeks = currentMonth.getWeeks();

        // erase all
        $("#calendar").text("");
        //Olly's edit
       // $("#calendar").append("<div class = 'row'><div class = 'col' id = 'name'><h3 id='username-label'>" + username + " Calendar</h3></div></div>");
        $("#calendar").append("<div class = 'row'><div class = 'col' id = 'month-name'><h5>" + monthNames[currentMonth.month] + " " + currentMonth.year + "</h5></div></div>");

        $("#calendar").append("<div class = 'row' id = 'dayNames'></div>");
        for (let colIndex = 0; colIndex < calWidth; ++colIndex) {
            $("#dayNames").append("<div class = 'col dayName' id='" + dayNames[colIndex] + "'><h6>" + dayNames[colIndex] + "</h6></div>");
        }

        for (let rowIndex = 0; rowIndex < weeks.length; ++rowIndex) {
            $("#calendar").append("<div class = 'row week' id = 'week-" + rowIndex + "'></div>");
            let week = weeks[rowIndex].getDates();
            for (let colIndex = 0; colIndex < calWidth; ++colIndex) {
                $("#week-" + rowIndex).append("<div class = 'col day' id='day-" + dayNames[colIndex] + rowIndex + "'></div>");
                let thisDate = week[colIndex];
                if (thisDate.getMonth() == currentMonth.getDateObject(1).getMonth()) {
                    $("#day-" + dayNames[colIndex] + rowIndex).addClass("current");
                    if (thisDate.getDate() == currentDate.getDate() && thisDate.getMonth() == currentDate.getMonth() && thisDate.getFullYear() == currentDate.getFullYear()) {
                        $("#day-" + dayNames[colIndex] + rowIndex).addClass("today");
                    }
                } else {
                    $("#day-" + dayNames[colIndex] + rowIndex).addClass("non-current");
                }

                // buttons in the calendar...
                $("#day-" + dayNames[colIndex] + rowIndex).append(`<p>${thisDate.getDate()}</p>`);
                let numEvents = "";
                $.post(
                    'getNumEvents.php',
                    {
                        date: thisDate.getDate(),
                        month: thisDate.getMonth() + 1,
                        year: thisDate.getFullYear(),
                    }
                ).done(function (result) {
                    numEvents = $.trim(result);
                    if ($("#day-" + dayNames[colIndex] + rowIndex).hasClass("current")) {
                        if (numEvents != "0") {
                            if (numEvents == "1") {
                                $("#day-" + dayNames[colIndex] + rowIndex).append(`<button class="btn-primary view-events" id="view-events-${thisDate.getDate()}">1 event</button>`);
                            } else {
                                $("#day-" + dayNames[colIndex] + rowIndex).append(`<button class="btn-primary view-events" id="view-events-${thisDate.getDate()}">${numEvents} events</button>`);
                            }
                            $(`#view-events-${thisDate.getDate()}`).on("click", function (e) {
                                showEventsActionArea(thisDate);
                            });
                        }
                        // Button to open the add event form
                        $("#day-" + dayNames[colIndex] + rowIndex).append(`<button class="btn-secondary add-event" id="add-event-${thisDate.getDate()}">add event</button>`);
                        $(`#add-event-${thisDate.getDate()}`).on("click", function (e) {
                            addEventActionArea(thisDate);
                            $('html,body').animate({
                                scrollTop: $("#action-area").offset().top
                            }, 'slow');
                        });
                    }
                });
            }
        }
    }

    const showEventsActionArea = (date) => {
        resetCal();
        actionArea = $("#action-area");
        $.post(
            'getUserEvents.php',
            {
                date: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
            }
        ).done(function (result) {
            events = jQuery.parseJSON(result);
            actionArea.html(
                `<h2> Your Events on ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}</h2>
                <br>
                <div class = "container" id="myEvents">`
            );
            for (let i = 0; i < events.length; ++i) {
                event = events[i];
                actionArea.append(`
                    <br>
                    <div class = "event">   
                        <h4>
                            ${event['event_time']} -- <strong>${event['title']}</strong>
                        </h4>
                        <p>
                             ${event['description']}
                        </p>
                        <div class = "${event['color']}">
                            |
                        </div>
                        <br>
                        <div class="btn-group">
                            <button class="btn btn-primary" id="edit-event-button-${i}">Edit</button>
                            <button class="btn btn-danger" id="delete-event-button-${i}">
                                <input type="hidden" id="delete-token" name="token" value="<?php echo $_SESSION['token'] ?>" />
                                Delete
                            </button>
                        </div>
                    </div>
                `);

                // hooking up the edit event button to post
                editEventButton = $(`#edit-event-button-${i}`);
                editEventButton.on("click", function(e) {
                    editEventActionArea(date, event['event_time'], event['event_id'], event['title'], event['color'], event['description'], "me")//
                });

                // hooking up the delete event button to post
                deleteEventButton = $(`#delete-event-button-${i}`);
                deleteEventButton.on("click", function(e) {
                    $.post(
                        'deleteEvent.php',
                        {
                            event_id: event['event_id'],
                            token: $("#delete-token").val()
                        }
                    ).done(function (result) {
                        showEventsActionArea(date);
                    });
                });
            }
        });
        $('html,body').animate({
            scrollTop: $("#action-area").offset().top
        }, 'slow');
    }

    const addEventActionArea = (date) => {
        //clear the action area
        actionArea = $("#action-area");
        actionArea.html(`
            <h2> New Event on ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}</h2>
            <form action = "addEvent.php" method = "POST" class = "form-group" id="add-event-form">
                <label> Title </label>
                <input type="text" name="title" minlength = "1" maxlength = "99" class = "form-control" required/>
                <br><label> Additional Event Participants (Optional) </label>
                <input type="text" name="owners" minlength = "1" maxlength = "199" class = "form-control" placeholder="username1, username2, username3" />
                <br><label> Time of Day </label>
                <input type="time" name="time" class = "form-control" required/>
                <br><label> Description (Optional) </label>
                <textarea name="description" rows="4" class="form-control"></textarea>
                <br>
                <label> Color Tag </label>
                <div class = "row">
                    <div class = "col white">
                        <input type="radio" class = "form-control" name = "color" value = "white" id = "white" checked />
                    </div>
                    <div class = "col red">
                        <input type="radio" class = "form-control" name = "color" value = "red" id = "red"/>
                    </div>
                    <div class = "col orange">
                        <input type="radio" class = "form-control" name = "color" value = "orange" id = "orange"/>
                    </div>
                    <div class = "col yellow">
                        <input type="radio" class = "form-control" name = "color" value = "yellow" id = "yellow"/>
                    </div>
                    <div class = "col green">
                        <input type="radio" class = "form-control" name = "color" value = "green" id = "green"/>
                    </div>
                    <div class = "col blue">
                        <input type="radio" class = "form-control" name = "color" value = "blue" id = "blue"/>
                    </div>
                    <div class = "col indigo">
                        <input type="radio" class = "form-control" name = "color" value = "indigo" id = "indigo"/>
                    </div>
                    <div class = "col violet">
                        <input type="radio" class = "form-control" name = "color" value = "violet" id = "violet"/>
                    </div>
                </div>
                <br>
                <input type="hidden" name="token" value=" <?php echo $_SESSION['token'] ?>" />
                <input type="submit" id="create-event-button" value = "Create Event" class = "form-control btn-secondary"/>
            </form>

        `);
        $(`#create-event-button`).on("click", function (e) {
            e.preventDefault();
            addEventForm = $("#add-event-form");
            $.post(
                addEventForm.attr('action'),
                {
                    date: date.getDate(),
                    month: date.getMonth() + 1,
                    year: date.getFullYear(),
                    time: $('input[name="time"]').val(),
                    title: $('input[name="title"]').val(),
                    color: $('input[name="color"]:checked').val(),
                    description: $.trim($('textarea[name="description"]').val()),
                    owners: $.trim($('input[name="owners"]').val())
                }
            ).done(function (result) {
                showEventsActionArea(date);
            });
        });
    };

    const editEventActionArea = (date, time, event_id, title, color, description, owners) => {
        //clear the action area
        dateMonth = (date.getMonth() + 1).toString();
        if (dateMonth.length < 2) {
            dateMonth = "0" + dateMonth;
        }
        dateDate = date.getDate().toString();
        if (dateDate.length < 2) {
            dateDate = "0" + dateDate;
        }
        datestring = date.getFullYear().toString() + "-" + dateMonth + "-" + dateDate;
        actionArea = $("#action-area");
        actionArea.html(`
            <h2> Edit Event </h2>
            <form action = "editEvent.php" method = "POST" class = "form-group" id="edit-event-form">
                <label> Title </label>
                <input type="text" name="title" minlength = "1" maxlength = "99" class = "form-control" value="${title}" required/>
                <br><label> Additional Event Participants (Optional) </label>
                <input type="text" name="owners" minlength = "1" maxlength = "199" class = "form-control" value="${owners}" />
                <br><label> Date </label>
                <input type="date" name="date" class = "form-control" value="${datestring}" required/>
                <br><label> Time of Day </label>
                <input type="time" name="time" class = "form-control" value="${time}" required/>
                <br><label> Description (Optional) </label>
                <textarea name="description" rows="4" class="form-control">${description}</textarea>
                <br>
                <label> Color Tag </label>
                <div class = "row">
                    <div class = "col white">
                        <input type="radio" class = "form-control" name = "color" value = "white" id = "white" checked />
                    </div>
                    <div class = "col red">
                        <input type="radio" class = "form-control" name = "color" value = "red" id = "red"/>
                    </div>
                    <div class = "col orange">
                        <input type="radio" class = "form-control" name = "color" value = "orange" id = "orange"/>
                    </div>
                    <div class = "col yellow">
                        <input type="radio" class = "form-control" name = "color" value = "yellow" id = "yellow"/>
                    </div>
                    <div class = "col green">
                        <input type="radio" class = "form-control" name = "color" value = "green" id = "green"/>
                    </div>
                    <div class = "col blue">
                        <input type="radio" class = "form-control" name = "color" value = "blue" id = "blue"/>
                    </div>
                    <div class = "col indigo">
                        <input type="radio" class = "form-control" name = "color" value = "indigo" id = "indigo"/>
                    </div>
                    <div class = "col violet">
                        <input type="radio" class = "form-control" name = "color" value = "violet" id = "violet"/>
                    </div>
                </div>
                <br>
                <input type="submit" id="edit-event-button" value = "Edit Event" class = "form-control btn-secondary"/>
            </form>

        `);
        $('input[name="color"][value="' + color + '"]').prop('checked',true);
        $(`#edit-event-button`).on("click", function (e) {
            e.preventDefault();
            editEventForm = $("#edit-event-form");
            $.post(
                editEventForm.attr('action'),
                {
                    date: $('input[name="date"]').val(),
                    time: $('input[name="time"]').val(),
                    title: $('input[name="title"]').val(),
                    color: $('input[name="color"]:checked').val(),
                    description: $.trim($('textarea[name="description"]').val()),
                    owners: $.trim($('input[name="owners"]').val()),
                    event_id: event_id
                }
            ).done(function (result) {
                alert(result);
                showEventsActionArea(date);
            });
        });
    };

    const actionFailedActionArea = () => {
        actionArea = $("#action-area");
        actionArea.text("");
        alert("Action Failed");
    }

    resetCal();




// Login Function
function loginAjax(event) {
          username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch('http://ec2-3-136-160-212.us-east-2.compute.amazonaws.com/m5/login_ajax.php', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => updateHTMLOnLogin(data.success, username, data.message, data.test))
        .then(resetCal())
        //console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`),
        .catch(err => console.error(err));
        
}


// Change the html of log in inputs after login occurs
function updateHTMLOnLogin(success, user, message, token){
    if(success){
        console.log(success);
        loggedin = true;
        console.log("You've been logged in!");
        $('#login').html(`
        <input type="submit" value="Log Out" id="logout-submit"></input>
        <br>
        <h3 id='username-label'> ${user}'s Calendar</h3>
        `); 
        $("#login-result").html("");
        document.getElementById("logout-submit").addEventListener("click", logOut, false );
        // Set the global token variable
        token = token;
    }else{
        console.log(`Log in failed: ${message}`);
        $("#login-result").html("Login Failed");
    }
}

function logOut(event){
    fetch('http://ec2-3-136-160-212.us-east-2.compute.amazonaws.com/m5/logout.php')
    .then((response) => { return response.json();})
    .then((data) => updateHTMLOnLogout(data.success, data.message))
    .then(resetCal())
    .catch(error => console.error('Error:', error));
}

function updateHTMLOnLogout(success, message){
    if(success){    
        console.log(success);
        $("#login").html(`<input class="login" type="text" name="username" placeholder="Username" id="username">
        <input class="login" type="password" name="password" placeholder="Password" id="password">
        <input class="login" type="submit" value="Log In" id="login-submit">
        <line  class="login">New User? <input type="button" value="register" id="register"></line>
        <input id="csrf-token" type="hidden">
        <div class = 'row'><div class = 'col' id = 'name'><h3 id='username-label'> This Could Be Your Calendar</h3></div></div>`);
        document.getElementById("login-submit").addEventListener("click", loginAjax, false); 
        document.getElementById("register").addEventListener("click", displaySignUpHTML, false); 
    }else {
        console.log(success + ", " + message);
    }
}

function displaySignUpHTML(event){
    $("#login").html(` 
    <input type="text" name="new-username" placeholder="Username" id="new-username">
    <input type="password" name="new-password" placeholder="Password" id="new-password">
    <input type="text" placeholder="First Name" id="first-name">
    <input type="text" placeholder="Last Name" id="last-name">
    <input type="submit" value="Sign Up" id="signup-submit">`);
    document.getElementById("signup-submit").addEventListener("click", signUpAjax, false);
}

function signUpAjax(event){
    username = $("#new-username").val();
    const password = $("#new-password").val();
    const first_name = $("#first-name").val();
    const last_name = $("#last-name").val();

    let s_data = {'username': username, 'password': password, 'first_name': first_name, 'last_name': last_name};
    //CHANGE THIS URL
    fetch('http://ec2-3-136-160-212.us-east-2.compute.amazonaws.com/m5-olly/signup.php', {
            method: 'POST',
            body: JSON.stringify(s_data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(s_data => updateHTMLOnLogin(s_data.success, username, s_data.message))
        //console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`),
        .catch(err => console.error(err));
}


}); 