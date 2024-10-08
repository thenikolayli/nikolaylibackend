async function check_password() {
    const csrf_token = get_cookie("csrftoken");
    const password = document.getElementById('password').value;
    const response = await fetch('/api/keyclub/check_password/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrf_token
        },
        body: JSON.stringify({password}),
    });

    const result = await response.json();
    console.log(result.id);
    if (response.ok) {
        document.getElementById(result.id).innerHTML = result.content;
        if (result.file) {
            const script = document.createElement('script');
            script.src = result.file;
            document.body.appendChild(script);
        }
        console.log(result);
    }
}