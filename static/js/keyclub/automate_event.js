async function automate_event() {
    document.getElementById("automate-button").setAttribute("disabled", "true");
    const csrf_token = get_cookie("csrftoken")
    const event_link = document.getElementById("event_link").value;
    const hours_multiplier = document.getElementById("hours_multiplier").value;
    const response = await fetch('/api/keyclub/automate_event/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrf_token
        },
        body: JSON.stringify({event_link, hours_multiplier}),
    });

    const result = await response.json();

    console.log(result);
    if (result.error) {
        document.getElementById("api-response").innerHTML = "Error:<br>" + result.error;
    } else {
        document.getElementById("api-response").innerHTML = result.event_title + " successfully automated!<br>" +
        result.data +
        "<br>People filled out:<br>" +
        result.updated +
        "<br>People not filled out:<br>" +
        result.not_updated;
    }
    document.getElementById("automate-button").removeAttribute("disabled");
}