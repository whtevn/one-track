'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IS_ARRAY = exports.DELETE = exports.PUT = exports.POST = exports.GET = exports.Send = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functionBindery = require('./lib/function-bindery');

Object.defineProperty(exports, 'Send', {
  enumerable: true,
  get: function () {
    return _functionBindery.Send;
  }
});

var _pathify = require('./lib/pathify');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.GET = _pathify.GET;
exports.POST = _pathify.POST;
exports.PUT = _pathify.PUT;
exports.DELETE = _pathify.DELETE;
exports.IS_ARRAY = _functionBindery.IS_ARRAY;

var RouteManager = function () {
  function RouteManager() {
    _classCallCheck(this, RouteManager);

    for (var _len = arguments.length, routers = Array(_len), _key = 0; _key < _len; _key++) {
      routers[_key] = arguments[_key];
    }

    this.routes = _pathify.combine_routers.apply(undefined, [this].concat(routers));
  }

  _createClass(RouteManager, [{
    key: 'GET',
    value: function GET() {
      this.routes = _pathify.new_route.apply(undefined, [this.routes, _pathify.GET].concat(Array.prototype.slice.call(arguments)));
      return this;
    }
  }, {
    key: 'POST',
    value: function POST() {
      this.routes = _pathify.new_route.apply(undefined, [this.routes, _pathify.POST].concat(Array.prototype.slice.call(arguments)));
      return this;
    }
  }, {
    key: 'PUT',
    value: function PUT() {
      this.routes = _pathify.new_route.apply(undefined, [this.routes, _pathify.PUT].concat(Array.prototype.slice.call(arguments)));
      return this;
    }
  }, {
    key: 'DELETE',
    value: function DELETE() {
      this.routes = _pathify.new_route.apply(undefined, [this.routes, _pathify.DELETE].concat(Array.prototype.slice.call(arguments)));
      return this;
    }
  }, {
    key: 'find',
    value: function find(method, path) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      return _functionBindery.find_and_run.apply(undefined, [this.routes, method, path].concat(args));
    }
  }]);

  return RouteManager;
}();

exports.default = RouteManager;