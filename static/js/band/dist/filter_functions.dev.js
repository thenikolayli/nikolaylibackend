"use strict";

function filter_create_item() {
  var csrf_token, name, response, result;
  return regeneratorRuntime.async(function filter_create_item$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          csrf_token = get_cookie("csrftoken");
          name = document.getElementById("filter_instrument_name").value;
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch("/api/percussion/filter/", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "X-CSRFToken": csrf_token
            },
            body: JSON.stringify({
              name: name
            })
          }));

        case 4:
          response = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(response.json());

        case 7:
          result = _context.sent;

          if (result.data) {
            filter_refresh_items(result.data);
          }

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}

function filter_get_item() {
  var response, result;
  return regeneratorRuntime.async(function filter_get_item$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(fetch("/api/percussion/filter/", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }));

        case 2:
          response = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(response.json());

        case 5:
          result = _context2.sent;

          if (result.data) {
            filter_refresh_items(result.data);
          }

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function filter_delete_item(item) {
  var csrf_token, response, result;
  return regeneratorRuntime.async(function filter_delete_item$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          csrf_token = get_cookie("csrftoken");
          _context3.next = 3;
          return regeneratorRuntime.awrap(fetch("/api/percussion/filter/", {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              "X-CSRFToken": csrf_token
            },
            body: JSON.stringify({
              "name": item
            })
          }));

        case 3:
          response = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(response.json());

        case 6:
          result = _context3.sent;

          if (result.data) {
            filter_refresh_items(result.data);
          }

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function filter_refresh_items(items) {
  var sorted_html, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step;

  return regeneratorRuntime.async(function filter_refresh_items$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          sorted_html = "";
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context4.prev = 4;

          for (_iterator = items[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            instrument = _step.value;
            sorted_html += "<li><div class=\"d-flex align-items-center\"><h4>" + instrument + "</h4>\n        <button class=\"btn d-flex justify-content-center align-items-center p-0 ms-2\" style=\"width: 1.5em; height: 1.5em;\" onclick=\"filter_delete_item('" + instrument + "')\"><img src=/static/images/minus_icon.png class=\"w-100 h-100\"></button></div></li>";
          }

          _context4.next = 12;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](4);
          _didIteratorError = true;
          _iteratorError = _context4.t0;

        case 12:
          _context4.prev = 12;
          _context4.prev = 13;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 15:
          _context4.prev = 15;

          if (!_didIteratorError) {
            _context4.next = 18;
            break;
          }

          throw _iteratorError;

        case 18:
          return _context4.finish(15);

        case 19:
          return _context4.finish(12);

        case 20:
          document.getElementById("filter_instrument_index").innerHTML = sorted_html;

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 8, 12, 20], [13,, 15, 19]]);
}

function filter_items() {
  var location_pk, csrf_token, response, result, to_bring, alr_there, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3;

  return regeneratorRuntime.async(function filter_items$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          location_pk = document.getElementById("filter_location_select").value;
          csrf_token = get_cookie("csrftoken");
          _context5.next = 4;
          return regeneratorRuntime.awrap(fetch("/api/percussion/filter_equipment/", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "X-CSRFToken": csrf_token
            },
            body: JSON.stringify({
              location_pk: location_pk
            })
          }));

        case 4:
          response = _context5.sent;
          _context5.next = 7;
          return regeneratorRuntime.awrap(response.json());

        case 7:
          result = _context5.sent;
          to_bring = "";
          alr_there = "";

          if (!result.data) {
            _context5.next = 51;
            break;
          }

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context5.prev = 14;

          for (_iterator2 = result.data.to_bring[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            instrument = _step2.value;
            to_bring += "<li><p class='fs-5 d1-c'>" + instrument + "</p></li>";
          }

          _context5.next = 22;
          break;

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](14);
          _didIteratorError2 = true;
          _iteratorError2 = _context5.t0;

        case 22:
          _context5.prev = 22;
          _context5.prev = 23;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 25:
          _context5.prev = 25;

          if (!_didIteratorError2) {
            _context5.next = 28;
            break;
          }

          throw _iteratorError2;

        case 28:
          return _context5.finish(25);

        case 29:
          return _context5.finish(22);

        case 30:
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context5.prev = 33;

          for (_iterator3 = result.data.alr_there[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            instrument = _step3.value;
            alr_there += "<li><p class='fs-5 d1-c'>" + instrument + "</p></li>";
          }

          _context5.next = 41;
          break;

        case 37:
          _context5.prev = 37;
          _context5.t1 = _context5["catch"](33);
          _didIteratorError3 = true;
          _iteratorError3 = _context5.t1;

        case 41:
          _context5.prev = 41;
          _context5.prev = 42;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 44:
          _context5.prev = 44;

          if (!_didIteratorError3) {
            _context5.next = 47;
            break;
          }

          throw _iteratorError3;

        case 47:
          return _context5.finish(44);

        case 48:
          return _context5.finish(41);

        case 49:
          document.getElementById("to_bring_list").innerHTML = to_bring;
          document.getElementById("alr_there_list").innerHTML = alr_there;

        case 51:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[14, 18, 22, 30], [23,, 25, 29], [33, 37, 41, 49], [42,, 44, 48]]);
}

window.onload = filter_get_item();