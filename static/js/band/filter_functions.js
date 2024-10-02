async function filter_create_item() {
    const csrf_token = get_cookie("csrftoken");
    const name = document.getElementById("filter_instrument_name").value;
    
    const response = await fetch("/api/percussion/filter/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrf_token
        },
        body: JSON.stringify({name}),
    });

    const result = await response.json();

    if (result.data) {
        filter_refresh_items(result.data)
    }
}

async function filter_get_item() {
    const response = await fetch("/api/percussion/filter/", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const result = await response.json();

    if (result.data) {
        filter_refresh_items(result.data)
    }
}

async function filter_delete_item(item) {
    const csrf_token = get_cookie("csrftoken");
    
    const response = await fetch("/api/percussion/filter/", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrf_token
        },
        body: JSON.stringify({"name": item}),
    });

    const result = await response.json();

    if (result.data) {
        filter_refresh_items(result.data)
    }
}

async function filter_refresh_items(items) {
    var sorted_html = "";

    for (instrument of items) {
        sorted_html += `<li class="flex flex-row"><h4 class="text-xl text-d1 mr-2">• ` + instrument + 
        `</h4><button class="size-5 flex self-center pb-1" onclick="filter_delete_item('` + instrument + `')"><img src=/static/images/minus_icon.png></button></li>`;
    }
    document.getElementById("filter_instrument_index").innerHTML = sorted_html;
}

async function filter_items() {
    const location_pk = document.getElementById("filter_location_select").value;
    const csrf_token = get_cookie("csrftoken");

    const response = await fetch("/api/percussion/filter_equipment/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrf_token
        },
        body: JSON.stringify({location_pk}),
    });

    const result = await response.json();
    var to_bring = "";
    var alr_there = "";

    if (result.data) {
        for (instrument of result.data.to_bring) {
            to_bring += "<li class='flex flex-row'><p class='text-xl text-d1'>• " + instrument + "</p></li>"
        }
        for (instrument of result.data.alr_there) {
            alr_there += "<li class='flex flex-row'><p class='text-xl text-d1'>• " + instrument + "</p></li>"
        }
        
        document.getElementById("to_bring_list").innerHTML = to_bring;
        document.getElementById("alr_there_list").innerHTML = alr_there;
    }
}

window.onload = filter_get_item();