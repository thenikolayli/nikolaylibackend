"use strict";

function refresh_data() {
  var response, result, sorted_html, dropdown_html, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, location, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, instrument;

  return regeneratorRuntime.async(function refresh_data$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch('/api/band/refresh_data/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }));

        case 2:
          response = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(response.json());

        case 5:
          result = _context.sent;
          sorted_html = "";
          dropdown_html = "";

          if (!result.data) {
            _context.next = 57;
            break;
          }

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 12;
          _iterator = result.data.locations[Symbol.iterator]();

        case 14:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 41;
            break;
          }

          location = _step.value;
          dropdown_html += "<option value=" + location.id + ">" + location.name + "</option>\"";
          sorted_html += '<li><div class="d-flex align-items-center"><h4>' + location.name + "</h4><button class=\"btn d-flex justify-content-center align-items-center p-0 ms-2\" style=\"width: 1.5em; height: 1.5em;\" onclick=\"delete_item('location'," + location.id + ")\"><img src=/static/images/minus_icon.png class=\"w-100 h-100\"></button>" + "</div><ul>";
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 21;

          for (_iterator2 = result.data.instruments[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            instrument = _step2.value;

            if (instrument.location == location.id) {
              sorted_html += '<li><div class="d-flex align-items-center"><p class="fs-5 lh-sm">' + instrument.name + "</p><button class=\"btn d-flex justify-content-center align-items-center align-self-center p-0 ms-1 mb-2\" style=\"width: 1em; height: 1em;\" onclick=\"delete_item('instrument'," + instrument.id + ")\"><img src=/static/images/minus_icon.png class=\"w-100 h-100\"></button>" + '</div></li>';
            }
          }

          _context.next = 29;
          break;

        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](21);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t0;

        case 29:
          _context.prev = 29;
          _context.prev = 30;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 32:
          _context.prev = 32;

          if (!_didIteratorError2) {
            _context.next = 35;
            break;
          }

          throw _iteratorError2;

        case 35:
          return _context.finish(32);

        case 36:
          return _context.finish(29);

        case 37:
          sorted_html += "</ul></li>";

        case 38:
          _iteratorNormalCompletion = true;
          _context.next = 14;
          break;

        case 41:
          _context.next = 47;
          break;

        case 43:
          _context.prev = 43;
          _context.t1 = _context["catch"](12);
          _didIteratorError = true;
          _iteratorError = _context.t1;

        case 47:
          _context.prev = 47;
          _context.prev = 48;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 50:
          _context.prev = 50;

          if (!_didIteratorError) {
            _context.next = 53;
            break;
          }

          throw _iteratorError;

        case 53:
          return _context.finish(50);

        case 54:
          return _context.finish(47);

        case 55:
          document.getElementById("instrument-index").innerHTML = sorted_html;
          document.getElementById("location_dropdown").innerHTML = dropdown_html;

        case 57:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[12, 43, 47, 55], [21, 25, 29, 37], [30,, 32, 36], [48,, 50, 54]]);
}

window.onload = refresh_data();