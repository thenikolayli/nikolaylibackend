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
            api_endpoint = '/api/percussion/location/';
            body = {
              name: name
            };
          } else if (item_type == "instrument") {
            api_endpoint = '/api/percussion/instrument/';
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

function delete_item(item_type, item_id) {
  var csrf_token, api_endpoint, response, result;
  return regeneratorRuntime.async(function delete_item$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          csrf_token = get_cookie("csrftoken");

          if (item_type == "location") {
            api_endpoint = "/api/percussion/location/" + item_id + "/";
          } else if (item_type == "instrument") {
            api_endpoint = "/api/percussion/instrument/" + item_id + "/";
          }

          console.log(api_endpoint);
          _context2.next = 5;
          return regeneratorRuntime.awrap(fetch(api_endpoint, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              "X-CSRFToken": csrf_token
            }
          }));

        case 5:
          response = _context2.sent;
          _context2.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          result = _context2.sent;

          if (result.data) {
            document.getElementById("api-response").innerHTML = result.data;
            refresh_data();
          } else {
            document.getElementById("api-response").innerHTML = result.error;
          }

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function refresh_data() {
  var response, result, sorted_html, dropdown_html, filter_dropdown_html, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, location, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, instrument;

  return regeneratorRuntime.async(function refresh_data$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(fetch('/api/percussion/refresh_data/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }));

        case 2:
          response = _context3.sent;
          _context3.next = 5;
          return regeneratorRuntime.awrap(response.json());

        case 5:
          result = _context3.sent;
          sorted_html = "";
          dropdown_html = "";
          filter_dropdown_html = "";

          if (!result.data) {
            _context3.next = 60;
            break;
          }

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 13;
          _iterator = result.data.locations[Symbol.iterator]();

        case 15:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context3.next = 43;
            break;
          }

          location = _step.value;

          if (location.name != "jhs") {
            filter_dropdown_html += "<option value=" + location.id + ">" + location.name + "</option>\"";
          }

          dropdown_html += "<option value=" + location.id + ">" + location.name + "</option>\"";
          sorted_html += '<li><div class="d-flex align-items-center"><h4>' + location.name + "</h4><button class=\"btn d-flex justify-content-center align-items-center p-0 ms-2\" style=\"width: 1.5em; height: 1.5em;\" onclick=\"delete_item('location'," + location.id + ")\"><img src=/static/images/minus_icon.png class=\"w-100 h-100\"></button>" + "</div><ul>";
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context3.prev = 23;

          for (_iterator2 = result.data.instruments[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            instrument = _step2.value;

            if (instrument.location == location.id) {
              sorted_html += '<li><div class="d-flex align-items-center"><p class="fs-5 lh-sm d1-c">' + instrument.name + "</p><button class=\"btn d-flex justify-content-center align-items-center align-self-center p-0 ms-1 mb-2\" style=\"width: 1em; height: 1em;\" onclick=\"delete_item('instrument'," + instrument.id + ")\"><img src=/static/images/minus_icon.png class=\"w-100 h-100\"></button>" + '</div></li>';
            }
          }

          _context3.next = 31;
          break;

        case 27:
          _context3.prev = 27;
          _context3.t0 = _context3["catch"](23);
          _didIteratorError2 = true;
          _iteratorError2 = _context3.t0;

        case 31:
          _context3.prev = 31;
          _context3.prev = 32;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 34:
          _context3.prev = 34;

          if (!_didIteratorError2) {
            _context3.next = 37;
            break;
          }

          throw _iteratorError2;

        case 37:
          return _context3.finish(34);

        case 38:
          return _context3.finish(31);

        case 39:
          sorted_html += "</ul></li>";

        case 40:
          _iteratorNormalCompletion = true;
          _context3.next = 15;
          break;

        case 43:
          _context3.next = 49;
          break;

        case 45:
          _context3.prev = 45;
          _context3.t1 = _context3["catch"](13);
          _didIteratorError = true;
          _iteratorError = _context3.t1;

        case 49:
          _context3.prev = 49;
          _context3.prev = 50;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 52:
          _context3.prev = 52;

          if (!_didIteratorError) {
            _context3.next = 55;
            break;
          }

          throw _iteratorError;

        case 55:
          return _context3.finish(52);

        case 56:
          return _context3.finish(49);

        case 57:
          document.getElementById("instrument-index").innerHTML = sorted_html;
          document.getElementById("location_dropdown").innerHTML = dropdown_html;
          document.getElementById("filter_location_select").innerHTML = filter_dropdown_html;

        case 60:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[13, 45, 49, 57], [23, 27, 31, 39], [32,, 34, 38], [50,, 52, 56]]);
}

window.onload = refresh_data();