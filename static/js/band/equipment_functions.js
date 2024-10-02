async function create_item(item_type) {
    const csrf_token = get_cookie("csrftoken");
    if (item_type == "location") {
        const name = document.getElementById("location_name").value;
        var api_endpoint = '/api/percussion/location/';
        var body = {name};
    } else if (item_type == "instrument") {
        var api_endpoint = '/api/percussion/instrument/';
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
        document.getElementById("api_response").innerHTML = result.data;
        refresh_data();
    } else {
        document.getElementById("api_response").innerHTML = result.error;
    }
}

async function delete_item(item_type, item_id) {
    const csrf_token = get_cookie("csrftoken");
    if (item_type == "location") {
        var api_endpoint = "/api/percussion/location/" + item_id + "/";
    } else if (item_type == "instrument") {
        var api_endpoint = "/api/percussion/instrument/" + item_id + "/";
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
        document.getElementById("api_response").innerHTML = result.data;
        refresh_data();
    } else {
        document.getElementById("api_response").innerHTML = result.error;
    }
}

async function refresh_data() {
    const response = await fetch('/api/percussion/refresh_data/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const result = await response.json();
    var sorted_html = ""
    var dropdown_html = ""
    var filter_dropdown_html = ""

    if (result.data) {
        for (const location of result.data.locations) {
            if (location.name != "jhs") {
                filter_dropdown_html += `<option value=` + location.id + `>` + location.name + `</option>`;
            }    
            dropdown_html += `<option value=` + location.id + `>` + location.name + `</option>`;
            sorted_html += 
            '<div class="flex flex-row">' + 
            '<span class="text-2xl text-d1 mr-2">• ' + location.name + "</span>" +
            `<button class="w-7 flex self-end" onclick="delete_item('location',` + location.id + `)"><img src=/static/images/minus_icon.png></button></div>` + 

            `<div class="indent-4 flex flex-col">`;
            for (const instrument of result.data.instruments) {
                if (instrument.location == location.id) {
                    sorted_html += '<div class="flex flex-row"><span class="text-xl text-d1 mr-2">> ' + instrument.name + "</span>" +
                    `<button class="w-5" onclick="delete_item('instrument',` + instrument.id + `)"><img src=/static/images/minus_icon.png></button></div>`;
                }
            }
            sorted_html += "</div>";
        }

        document.getElementById("instrument_index").innerHTML = sorted_html;
        document.getElementById("location_dropdown").innerHTML = dropdown_html;
        document.getElementById("filter_location_select").innerHTML = filter_dropdown_html;
    }
}

window.onload = refresh_data();