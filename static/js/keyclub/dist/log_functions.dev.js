"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function log_event() {
  var csrf_token, event_link, hours_multiplier, response, result, logged, not_logged, _i, _Object$entries, _Object$entries$_i, person, info, _i2, _Object$entries2, _Object$entries2$_i, _person, _info;

  return regeneratorRuntime.async(function log_event$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          document.getElementById("event_log_button").setAttribute("disabled", "true");
          csrf_token = get_cookie("csrftoken");
          event_link = document.getElementById("event_link").value;
          hours_multiplier = document.getElementById("hours_multiplier").value;
          _context.next = 6;
          return regeneratorRuntime.awrap(fetch('/api/keyclub/log_event/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "X-CSRFToken": csrf_token
            },
            body: JSON.stringify({
              event_link: event_link,
              hours_multiplier: hours_multiplier
            })
          }));

        case 6:
          response = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(response.json());

        case 9:
          result = _context.sent;

          if (result.error) {
            document.getElementById("event_api_response").innerHTML = "Error:<br>" + result.error;
          } else {
            logged = [];
            not_logged = [];

            for (_i = 0, _Object$entries = Object.entries(result.logged); _i < _Object$entries.length; _i++) {
              _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), person = _Object$entries$_i[0], info = _Object$entries$_i[1];
              logged.push(person + " - " + info.hours + " hours ");
            }

            for (_i2 = 0, _Object$entries2 = Object.entries(result.not_logged); _i2 < _Object$entries2.length; _i2++) {
              _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2), _person = _Object$entries2$_i[0], _info = _Object$entries2$_i[1];
              not_logged.push(_person + " - " + _info.hours + " hours ");
            }

            document.getElementById("event_api_response").innerHTML = result.event_title + " successfully logged!<br>" + "<br>People filled out:<br>" + logged + "<br>People not filled out:<br>" + not_logged;
          }

          document.getElementById("event_log_button").removeAttribute("disabled");

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
}

function log_meeting() {
  var csrf_token, event_link, meeting_title, meeting_length, first_name_col, last_name_col, response, result, logged, not_logged, _i3, _Object$entries3, _Object$entries3$_i, person, info, _i4, _Object$entries4, _Object$entries4$_i, _person2, _info2;

  return regeneratorRuntime.async(function log_meeting$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          document.getElementById("meeting_log_button").setAttribute("disabled", "true");
          csrf_token = get_cookie("csrftoken");
          event_link = document.getElementById("meeting_link").value;
          meeting_title = document.getElementById("meeting_title").value;
          meeting_length = document.getElementById("meeting_length").value;
          first_name_col = document.getElementById("first_name_col").value;
          last_name_col = document.getElementById("last_name_col").value;
          _context2.next = 9;
          return regeneratorRuntime.awrap(fetch('/api/keyclub/log_event/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "X-CSRFToken": csrf_token
            },
            body: JSON.stringify({
              event_link: event_link,
              first_name_col: first_name_col,
              last_name_col: last_name_col,
              meeting_length: meeting_length,
              meeting_title: meeting_title
            })
          }));

        case 9:
          response = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(response.json());

        case 12:
          result = _context2.sent;

          if (result.error) {
            document.getElementById("meeting_api_response").innerHTML = "Error:<br>" + result.error;
          } else {
            logged = [];
            not_logged = [];

            for (_i3 = 0, _Object$entries3 = Object.entries(result.logged); _i3 < _Object$entries3.length; _i3++) {
              _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2), person = _Object$entries3$_i[0], info = _Object$entries3$_i[1];
              logged.push(person + " - " + info.hours + " hours ");
            }

            for (_i4 = 0, _Object$entries4 = Object.entries(result.not_logged); _i4 < _Object$entries4.length; _i4++) {
              _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2), _person2 = _Object$entries4$_i[0], _info2 = _Object$entries4$_i[1];
              not_logged.push(_person2 + " - " + _info2.hours + " hours ");
            }

            document.getElementById("meeting_api_response").innerHTML = result.event_title + " successfully logged!<br>" + "<br>People filled out:<br>" + logged + "<br>People not filled out:<br>" + not_logged;
          }

          document.getElementById("meeting_log_button").removeAttribute("disabled");

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
}