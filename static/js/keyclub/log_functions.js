async function log_event() {
    document.getElementById("event_log_button").setAttribute("disabled", "true");
    const csrf_token = get_cookie("csrftoken")
    const event_link = document.getElementById("event_link").value;
    const hours_multiplier = document.getElementById("hours_multiplier").value;
    const response = await fetch('/api/keyclub/log_event/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrf_token
        },
        body: JSON.stringify({event_link, hours_multiplier}),
    });

    const result = await response.json();

    if (result.error) {
        document.getElementById("event_api_response").innerHTML = "Error:<br>" + result.error;
    } else {
        var logged = []
        var not_logged = []

        for (const [person, info] of Object.entries(result.logged)) {
            logged.push(person + " - " + info.hours + " hours ")
        }
        for (const [person, info] of Object.entries(result.not_logged)) {
            not_logged.push(person + " - " + info.hours + " hours ")
        }

        document.getElementById("event_api_response").innerHTML = result.event_title + " successfully logged!<br>" +
        "<br>People filled out:<br>" +
        logged +
        "<br>People not filled out:<br>" +
        not_logged;
    }
    document.getElementById("event_log_button").removeAttribute("disabled");
}

async function log_meeting() {
    document.getElementById("meeting_log_button").setAttribute("disabled", "true");
    const csrf_token = get_cookie("csrftoken")
    const event_link = document.getElementById("meeting_link").value;
    const meeting_title = document.getElementById("meeting_title").value;
    const meeting_length = document.getElementById("meeting_length").value;
    const first_name_col = document.getElementById("first_name_col").value;
    const last_name_col = document.getElementById("last_name_col").value;
    const response = await fetch('/api/keyclub/log_event/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrf_token
        },
        body: JSON.stringify({event_link, first_name_col, last_name_col, meeting_length, meeting_title}),
    });

    const result = await response.json();

    if (result.error) {
        document.getElementById("meeting_api_response").innerHTML = "Error:<br>" + result.error;
    } else {
        var logged = []
        var not_logged = []

        for (const [person, info] of Object.entries(result.logged)) {
            logged.push(person + " - " + info.hours + " hours ")
        }
        for (const [person, info] of Object.entries(result.not_logged)) {
            not_logged.push(person + " - " + info.hours + " hours ")
        }

        document.getElementById("meeting_api_response").innerHTML = result.event_title + " successfully logged!<br>" +
        "<br>People filled out:<br>" +
        logged +
        "<br>People not filled out:<br>" +
        not_logged;
    }
    document.getElementById("meeting_log_button").removeAttribute("disabled");
}