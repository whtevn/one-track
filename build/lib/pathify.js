'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IS_ARRAY = exports.BAD_ROUTER = exports.NO_SUCH_ROUTE = exports.DELETE = exports.PUT = exports.POST = exports.GET = exports.INITIAL_ROUTES = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.duplicate = duplicate;
exports.paramify = paramify;
exports.add_route = add_route;
exports.retrieve_path = retrieve_path;
exports.execute_middleware = execute_middleware;

var _immutable = require('immutable');

var _functionBindery = require('./function-bindery');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var escapeStringRegexp = require('escape-string-regexp');

var INITIAL_ROUTES = exports.INITIAL_ROUTES = (0, _immutable.Map)({ GET: (0, _immutable.Map)({}), POST: (0, _immutable.Map)({}), PUT: (0, _immutable.Map)({}), DELETE: (0, _immutable.Map)({}) });

var GET = exports.GET = 'GET';
var POST = exports.POST = 'POST';
var PUT = exports.PUT = 'PUT';
var DELETE = exports.DELETE = 'DELETE';
var NO_SUCH_ROUTE = exports.NO_SUCH_ROUTE = { code: 404, msg: 'NO SUCH ROUTE' };
var BAD_ROUTER = exports.BAD_ROUTER = new Error("bad router given in generator");

var IS_ARRAY = exports.IS_ARRAY = true;

function objectify(keys, values) {
  var obj = {};
  for (var index in keys) {
    obj[keys[index]] = values[index];
  }
  return obj;
}

function duplicate(obj) {
  if (!obj.routes || !_typeof(obj.routes.asImmutable) === 'function') throw BAD_ROUTER;

  return obj.routes.asImmutable();
}

function regexify(path) {
  var regex = new RegExp(/:([^\/]*)/, 'g');
  return {
    params: (path.match(regex) || []).map(function (x) {
      return x.replace(':', '');
    }),
    description: "^" + escapeStringRegexp(path).replace(regex, "([^\\/]*)") + "/?$"
  };
}

function routify() {
  var routes = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_ROUTES : arguments[0];
  var method = arguments.length <= 1 || arguments[1] === undefined ? GET : arguments[1];
  var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  return opts.path ? routes.setIn([method, opts.path.description], opts) : routes;
}

function paramify(path, description, params) {
  var vals = path.match(new RegExp(description)).map(function (x) {
    return x;
  });
  return objectify(params, vals.slice(1, vals.length));
}

function add_route(routes, method, path) {
  for (var _len = arguments.length, func_set = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    func_set[_key - 3] = arguments[_key];
  }

  return routify(routes, method, { path: regexify(path),
    middleware: func_set
  });
}

function retrieve_path(method, path, routes) {
  var entry = routes.get(method).filter(function (val, test) {
    return path.match(new RegExp(test));
  }).first();
  if (!entry) throw NO_SUCH_ROUTE;
  return entry;
}

function execute_middleware(function_array, isArray) {
  var func_list = new _immutable.List(function_array);

  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  if (func_list.isEmpty()) return isArray ? args : args[0];
  var func = func_list.first();
  var remaining_functions = func_list.shift();
  return _functionBindery.run.apply(undefined, [func].concat(args)).then(function (result) {
    var result_is_array = Array.isArray(result) ? IS_ARRAY : false;
    if (result_is_array === IS_ARRAY) {
      return execute_middleware.apply(undefined, [remaining_functions, result_is_array].concat(_toConsumableArray(result)));
    } else {
      return execute_middleware(remaining_functions, result_is_array, result);
    }
  });
}