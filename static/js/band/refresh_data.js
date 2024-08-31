async function refresh_data() {
    const response = await fetch('/api/band/refresh_data/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const result = await response.json();
    var sorted_html = ""
    var dropdown_html = ""
    if (result.data) {
        for (const location of result.data.locations) {
            dropdown_html += `<option value=` + location.id + `>` + location.name + `</option>"`;
            sorted_html += '<li><div class="d-flex align-items-center"><h4>' +
            location.name + 
            `</h4><button class="btn d-flex justify-content-center align-items-center p-0 ms-2" style="width: 1.5em; height: 1.5em;" onclick="delete_item('location',` + location.id + `)"><img src=/static/images/minus-sign.png class="w-100 h-100"></button>` +
            "</div><ul>";
            for (const instrument of result.data.instruments) {
                if (instrument.location == location.id) {
                    sorted_html += '<li><div class="d-flex align-items-center"><p class="fs-5 lh-sm">' + 
                    instrument.name + 
                    `</p><button class="btn d-flex justify-content-center align-items-center align-self-center p-0 ms-1 mb-2" style="width: 1em; height: 1em;" onclick="delete_item('instrument',` + instrument.id + `)"><img src=/static/images/minus-sign.png class="w-100 h-100"></button>` +
                    '</div></li>';
                }
            }
            sorted_html += "</ul></li>";
        }
        document.getElementById("instrument-index").innerHTML = sorted_html;
        document.getElementById("location_dropdown").innerHTML = dropdown_html;
    }
}