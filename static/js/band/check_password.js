async function check_password() {
    const csrf_token = get_cookie("csrftoken");
    const password = document.getElementById('password').value;
    const response = await fetch('/api/percussion/check_password/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrf_token
        },
        body: JSON.stringify({password}),
    });

    const result = await response.json();

    if (result.error) {
        document.getElementById("incorrect_pass_field").innerHTML = result.error;
    } else if (result.data) {
        window.location.href = result.data;
    }
}