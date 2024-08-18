async function authorize() {
    console.log("attempt");
    const response = await fetch('/api/authorize/', {method: "POST"});
    const result = await response.json();

    window.location.href = result.redirect_url;
};