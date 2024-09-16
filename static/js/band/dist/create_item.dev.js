"use strict";

function create_item(item_type) {
  var csrf_token, name, api_endpoint, body, _name, type, subtype, location, response, result;

  return regeneratorRuntime.async(function create_item$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          csrf_token = get_cookie("csrftoken");

          if (item_type == "location") {
            name = document.getElementById("location_name").value;
            api_endpoint = '/api/band/location/';
            body = {
              name: name
            };
          } else if (item_type == "instrument") {
            api_endpoint = '/api/band/instrument/';
            _name = document.getElementById('instrument_name').value;
            type = document.getElementById('instrument_type').value;
            subtype = document.getElementById('instrument_subtype').value;
            location = document.getElementById('location_dropdown').value;
            body = {
              name: _name,
              type: type,
              subtype: subtype,
              location: location
            };
          }

          _context.next = 4;
          return regeneratorRuntime.awrap(fetch(api_endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "X-CSRFToken": csrf_token
            },
            body: JSON.stringify(body)
          }));

        case 4:
          response = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(response.json());

        case 7:
          result = _context.sent;

          if (result.data) {
            document.getElementById("api-response").innerHTML = result.data;
            refresh_data();
          } else {
            document.getElementById("api-response").innerHTML = result.error;
          }

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}