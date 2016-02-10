'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NO_SUCH_ROUTE = exports.DELETE = exports.PUT = exports.POST = exports.GET = exports.INITIAL_ROUTES = undefined;
exports.paramify = paramify;
exports.add_route = add_route;
exports.retrieve_path = retrieve_path;

var _immutable = require('immutable');

var escapeStringRegexp = require('escape-string-regexp');

var INITIAL_ROUTES = exports.INITIAL_ROUTES = (0, _immutable.Map)({ GET: (0, _immutable.Map)({}), POST: (0, _immutable.Map)({}), PUT: (0, _immutable.Map)({}), DELETE: (0, _immutable.Map)({}) });

var GET = exports.GET = 'GET';
var POST = exports.POST = 'POST';
var PUT = exports.PUT = 'PUT';
var DELETE = exports.DELETE = 'DELETE';
var NO_SUCH_ROUTE = exports.NO_SUCH_ROUTE = { code: 404, msg: 'NO SUCH ROUTE' };

function objectify(keys, values) {
  var obj = {};
  for (var index in keys) {
    obj[keys[index]] = values[index];
  }
  return obj;
}

function regexify(path) {
  var regex = new RegExp(/:([^\/]*)/, 'g');
  return {
    params: (path.match(regex) || []).map(function (x) {
      return x.replace(':', '');
    }),
    description: escapeStringRegexp(path).replace(regex, "([^\\/]*)") + "/?$"
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

function add_route(routes, method, path, classname) {
  var func = arguments.length <= 4 || arguments[4] === undefined ? '' : arguments[4];

  if (typeof func === 'string') func = classname[func];

  var path_regex_and_description = regexify(path);
  routes = routify(routes, method, { path: path_regex_and_description,
    route: { classname: classname, func: func }
  });
  return routes;
}

function retrieve_path(method, path, routes) {
  var entry = routes.get(method).filter(function (val, test) {
    return path.match(new RegExp(test));
  }).first();
  if (!entry) throw NO_SUCH_ROUTE;
  return entry;
}