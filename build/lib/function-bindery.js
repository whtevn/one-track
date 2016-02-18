'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NO_SUCH_ROUTE = exports.IS_ARRAY = undefined;
exports.Send = Send;
exports.find_and_run = find_and_run;

var _immutable = require('immutable');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var IS_ARRAY = exports.IS_ARRAY = true;
var NO_SUCH_ROUTE = exports.NO_SUCH_ROUTE = { code: 404, msg: 'NO SUCH ROUTE' };

function Send(arg_map) {
  return {
    to: function to(func) {
      return function () {
        var _arguments = arguments;

        var map_resolution = new Promise(function (resolve, reject) {
          return resolve(arg_map.apply(undefined, _arguments));
        });
        return map_resolution.then(function (result) {
          return run.apply(undefined, [func].concat(_toConsumableArray(result)));
        });
      };
    }
  };
}

function find_and_run(routes, method, path) {
  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  return new Promise(function (resolve, reject) {
    var entry = retrieve_path(method, path, routes);
    var params = paramify(path, entry.path.description, entry.path.params);

    resolve(execute_middleware.apply(undefined, [entry.middleware, IS_ARRAY, params].concat(args)));
  });
}

function retrieve_path(method, path, routes) {
  var entry = routes.get(method).filter(function (val, test) {
    return path.match(new RegExp(test));
  }).first();
  if (!entry) throw NO_SUCH_ROUTE;
  return entry;
}

function paramify(path, description, params) {
  var vals = path.match(new RegExp(description)).map(function (x) {
    return x;
  });
  return objectify(params, vals.slice(1, vals.length));
}

function objectify(keys, values) {
  var obj = {};
  for (var index in keys) {
    obj[keys[index]] = values[index];
  }
  return obj;
}

function run(func) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return new Promise(function (resolve, reject) {
    var _ref;

    var ctx = func[0] || args[args.length - 1];
    var result = (_ref = func[1] || func).call.apply(_ref, [ctx].concat(args));
    resolve(result);
  });
}

function execute_middleware(function_array, isArray) {
  var func_list = new _immutable.List(function_array);

  for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }

  if (func_list.isEmpty()) return isArray ? args : args[0];
  var func = func_list.first();
  var remaining_functions = func_list.shift();
  return run.apply(undefined, [func].concat(args)).then(function (result) {
    var result_is_array = Array.isArray(result) ? IS_ARRAY : false;
    if (result_is_array === IS_ARRAY) {
      return execute_middleware.apply(undefined, [remaining_functions, result_is_array].concat(_toConsumableArray(result)));
    } else {
      return execute_middleware(remaining_functions, result_is_array, result);
    }
  });
}