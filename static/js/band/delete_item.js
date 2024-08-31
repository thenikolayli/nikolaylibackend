async function delete_item(item_type, item_id) {
    const csrf_token = get_cookie("csrftoken");
    if (item_type == "location") {
        var api_endpoint = "/api/band/location/" + item_id + "/";
    } else if (item_type == "instrument") {
        var api_endpoint = "/api/band/instrument/" + item_id + "/";
    }
    console.log(api_endpoint);
    
    const response = await fetch(api_endpoint, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrf_token
        }
    });

    const result = await response.json();

    if (result.data) {
        document.getElementById("api-response").innerHTML = result.data;
        refresh_data();
    } else {
        document.getElementById("api-response").innerHTML = result.error;
    }
}