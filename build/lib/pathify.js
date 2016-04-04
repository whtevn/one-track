'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BAD_ROUTER = exports.DELETE = exports.PUT = exports.POST = exports.GET = exports.INITIAL_ROUTES = undefined;
exports.add_route = add_route;
exports.new_route = new_route;
exports.combine_routers = combine_routers;

var _immutable = require('immutable');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var escapeStringRegexp = require('escape-string-regexp');

var INITIAL_ROUTES = exports.INITIAL_ROUTES = (0, _immutable.Map)({ GET: (0, _immutable.Map)({}), POST: (0, _immutable.Map)({}), PUT: (0, _immutable.Map)({}), DELETE: (0, _immutable.Map)({}) });

var GET = exports.GET = 'GET';
var POST = exports.POST = 'POST';
var PUT = exports.PUT = 'PUT';
var DELETE = exports.DELETE = 'DELETE';
var BAD_ROUTER = exports.BAD_ROUTER = new Error("bad router given in generator");

var DUPLICATE_ROUTE = function DUPLICATE_ROUTE(method, path) {
  return new Error('DUPLICATED ROUTE: ' + method + ' ' + path);
};

function add_route(routes, method, path) {
  for (var _len = arguments.length, func_set = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    func_set[_key - 3] = arguments[_key];
  }

  if (typeof path === 'string') path = { path: regexify(path), middleware: func_set };

  return routify(routes, method, path);
}

function routify() {
  var routes = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_ROUTES : arguments[0];
  var method = arguments.length <= 1 || arguments[1] === undefined ? GET : arguments[1];
  var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  if (opts.path && routes.getIn([method, opts.path.description])) throw DUPLICATE_ROUTE(method, opts.path.description);

  return opts.path ? routes.setIn([method, opts.path.description], opts) : routes;
}

function regexify(path) {
  if (!path.match(/^\//)) path = '/' + path;
  if (path.match(/\/$/)) path = path.slice(0, -1);
  var regex = new RegExp(':([^\\/]*)', 'g');
  return {
    path: path,
    params: (path.match(regex) || []).map(function (x) {
      return x.replace(':', '');
    }),
    description: "^" + escapeStringRegexp(path).replace(regex, "([^\\/]*)") + "/?$"
  };
}

function new_route(routes, method) {
  try {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    routes = add_route.apply(undefined, [routes, method].concat(args));
  } catch (err) {
    console.log(err);
  }
  return routes;
}

function combine_routers() {
  for (var _len3 = arguments.length, routers = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    routers[_key3] = arguments[_key3];
  }

  return routers.reduce(function (prev, cur) {
    return add_batch(prev, cur.routes);
  }, routers[0].routes);
}

function add_batch() {
  var routes = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_ROUTES : arguments[0];
  var new_router = arguments.length <= 1 || arguments[1] === undefined ? INITIAL_ROUTES : arguments[1];

  var new_routes = new_router.reduce(function (prev, cur, method) {
    return [].concat(_toConsumableArray(prev), _toConsumableArray(cur.reduce(function (p, c, i) {
      return [].concat(_toConsumableArray(p), [{ method: method, regex: i, path: c }]);
    }, [])));
  }, []);
  return add_routes.apply(undefined, [routes].concat(_toConsumableArray(new_routes)));
}

function add_routes(routes, route) {
  if (route === undefined) return routes;

  for (var _len4 = arguments.length, remaining_routes = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    remaining_routes[_key4 - 2] = arguments[_key4];
  }

  var added_routes = remaining_routes.empty ? routes : add_routes.apply(undefined, [routes].concat(remaining_routes));
  return new_route(added_routes, route.method, route.path);
}