async function get_data() {
    const password = document.getElementById('password').value;
    const response = await fetch('/api/check_password/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({password}),
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById(result.id).innerHTML = result.content;
        if (result.file) {
            const script = document.createElement('script');
            script.src = result.file;
            document.body.appendChild(script);
        }
    }
}