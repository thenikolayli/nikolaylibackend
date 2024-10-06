async function log_event() {
    document.getElementById("event_log_button").setAttribute("disabled", true);
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
        document.getElementById("event_api_response").innerHTML = "<h1 class='text-xl text-d1'>Error</h1>" + "<h1 class='text-lg text-d1'>" + result.error + "<h1>";
    } else {
        var logged = "";
        var not_logged = "";

        for (const [person, info] of Object.entries(result.logged)) {
            logged += "<li class='text-md text-d1'>" + person + " - " + info.hours + " hours</li>"
        }
        for (const [person, info] of Object.entries(result.not_logged)) {
            not_logged += "<li class='text-md text-d1'>" + person + " - " + info.hours + " hours</li>"
        }

        document.getElementById("event_api_response").innerHTML = "<h1 class='text-xl text-d1 font-semibold'>" + result.event_title + " successfully logged!</h1>" +
        "<h1 class='text-lg text-d1'>People filled out:</h1>" +
        "<ul class='list-disc list-inside'>" + logged + "</ul>" +
        "<h1 class='text-lg text-d1'>People not filled out:</h1>" +
        "<ul class='list-disc list-inside'>" + not_logged + "</ul>";
    }
    document.getElementById("event_log_button").removeAttribute("disabled");
}

async function log_meeting() {
    document.getElementById("meeting_log_button").setAttribute("disabled", true);

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
        document.getElementById("meeting_api_response").innerHTML = "<h1 class='text-xl text-d1'>Error</h1>" + "<h1 class='text-lg text-d1'>" + result.error + "<h1>";
    } else {
        var logged = "";
        var not_logged = "";

        for (const [person, info] of Object.entries(result.logged)) {
            logged += "<li class='text-md text-d1'>" + person + " - " + info.hours + " hours</li>"
        }
        for (const [person, info] of Object.entries(result.not_logged)) {
            not_logged += "<li class='text-md text-d1'>" + person + " - " + info.hours + " hours</li>"
        }

        document.getElementById("meeting_api_response").innerHTML = "<h1 class='text-xl text-d1 font-semibold'>" + result.event_title + " successfully logged!</h1>" +
        "<h1 class='text-lg text-d1'>People filled out:</h1>" +
        "<ul class='list-disc list-inside'>" + logged + "</ul>" +
        "<h1 class='text-lg text-d1'>People not filled out:</h1>" +
        "<ul class='list-disc list-inside'>" + not_logged + "</ul>";
    }
    document.getElementById("meeting_log_button").removeAttribute("disabled");
}