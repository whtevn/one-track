"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.Send = Send;
exports.execute_middleware = execute_middleware;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function run(func) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return new Promise(function (resolve, reject) {
    var _ref;

    var ctx = func[0];
    var result = (_ref = func[1] || func).call.apply(_ref, [ctx].concat(args));
    resolve(result);
  });
}

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

function execute_middleware(function_array) {
  var func_list = new List(function_array);

  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  if (func_list.isEmpty()) return args[0];
  var func = func_list.first();
  var remaining_functions = func_list.shift();
  return run.apply(undefined, [func].concat(args)).then(function (result) {
    if (!Array.isArray(result)) result = [result];
    return execute_middleware.apply(undefined, [remaining_functions].concat(_toConsumableArray(result)));
  });
}