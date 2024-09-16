"use strict";

function delete_item(item_type, item_id) {
  var csrf_token, api_endpoint, response, result;
  return regeneratorRuntime.async(function delete_item$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          csrf_token = get_cookie("csrftoken");

          if (item_type == "location") {
            api_endpoint = "/api/band/location/" + item_id + "/";
          } else if (item_type == "instrument") {
            api_endpoint = "/api/band/instrument/" + item_id + "/";
          }

          console.log(api_endpoint);
          _context.next = 5;
          return regeneratorRuntime.awrap(fetch(api_endpoint, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              "X-CSRFToken": csrf_token
            }
          }));

        case 5:
          response = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          result = _context.sent;

          if (result.data) {
            document.getElementById("api-response").innerHTML = result.data;
            refresh_data();
          } else {
            document.getElementById("api-response").innerHTML = result.error;
          }

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
}