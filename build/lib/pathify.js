'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BAD_ROUTER = exports.NO_SUCH_ROUTE = exports.DELETE = exports.PUT = exports.POST = exports.GET = exports.INITIAL_ROUTES = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.duplicate = duplicate;
exports.add_route = add_route;

var _immutable = require('immutable');

var _functionBindery = require('./function-bindery');

var escapeStringRegexp = require('escape-string-regexp');

var INITIAL_ROUTES = exports.INITIAL_ROUTES = (0, _immutable.Map)({ GET: (0, _immutable.Map)({}), POST: (0, _immutable.Map)({}), PUT: (0, _immutable.Map)({}), DELETE: (0, _immutable.Map)({}) });

var GET = exports.GET = 'GET';
var POST = exports.POST = 'POST';
var PUT = exports.PUT = 'PUT';
var DELETE = exports.DELETE = 'DELETE';
var NO_SUCH_ROUTE = exports.NO_SUCH_ROUTE = { code: 404, msg: 'NO SUCH ROUTE' };
var BAD_ROUTER = exports.BAD_ROUTER = new Error("bad router given in generator");

function duplicate(obj) {
  if (!obj.routes || !_typeof(obj.routes.asImmutable) === 'function') throw BAD_ROUTER;

  return obj.routes.asImmutable();
}

function add_route(routes, method, path) {
  for (var _len = arguments.length, func_set = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    func_set[_key - 3] = arguments[_key];
  }

  return routify(routes, method, { path: regexify(path),
    middleware: func_set
  });
}

function routify() {
  var routes = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_ROUTES : arguments[0];
  var method = arguments.length <= 1 || arguments[1] === undefined ? GET : arguments[1];
  var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  return opts.path ? routes.setIn([method, opts.path.description], opts) : routes;
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