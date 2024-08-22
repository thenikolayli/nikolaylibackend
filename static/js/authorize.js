async function authorize() {
    const csrf_token = get_cookie("csrftoken")
    const response = await fetch('/api/authorize/', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrf_token
        }
    });
    const result = await response.json();

    window.location.href = result.redirect_url;
};