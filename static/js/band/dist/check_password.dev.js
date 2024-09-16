"use strict";

function check_password() {
  var csrf_token, password, response, result;
  return regeneratorRuntime.async(function check_password$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          csrf_token = get_cookie("csrftoken");
          password = document.getElementById('password').value;
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch('/api/percussion/check_password/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "X-CSRFToken": csrf_token
            },
            body: JSON.stringify({
              password: password
            })
          }));

        case 4:
          response = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(response.json());

        case 7:
          result = _context.sent;

          if (result.error) {
            document.getElementById("incorrect_pass_field").innerHTML = result.error;
          } else if (result.data) {
            window.location.href = result.data;
          }

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}