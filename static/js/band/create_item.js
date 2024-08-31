async function create_item(item_type) {
    const csrf_token = get_cookie("csrftoken");
    if (item_type == "location") {
        const name = document.getElementById("location_name").value;
        var api_endpoint = '/api/band/location/';
        var body = {name};
    } else if (item_type == "instrument") {
        var api_endpoint = '/api/band/instrument/';
        const name = document.getElementById('instrument_name').value;
        const type = document.getElementById('instrument_type').value;
        const subtype = document.getElementById('instrument_subtype').value;
        const location = document.getElementById('location_dropdown').value;
        var body = {name, type, subtype, location};
    }
    
    const response = await fetch(api_endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrf_token
        },
        body: JSON.stringify(body),
    });

    const result = await response.json();

    if (result.data) {
        document.getElementById("api-response").innerHTML = result.data;
        refresh_data();
    } else {
        document.getElementById("api-response").innerHTML = result.error;
    }
}