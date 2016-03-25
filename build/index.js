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

    this.routes = this.export_routes.apply(this, [this].concat(routers));
  }

  _createClass(RouteManager, [{
    key: 'GET',
    value: function GET() {
      return this.new_route.apply(this, [_pathify.GET].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: 'POST',
    value: function POST() {
      return this.new_route.apply(this, [_pathify.POST].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: 'PUT',
    value: function PUT() {
      return this.new_route.apply(this, [_pathify.PUT].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: 'DELETE',
    value: function DELETE() {
      return this.new_route.apply(this, [_pathify.DELETE].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: 'new_route',
    value: function new_route(method) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      this.routes = _pathify.add_route.apply(undefined, [this.routes, method].concat(args));
      return this;
    }
  }, {
    key: 'find',
    value: function find(method, path) {
      for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        args[_key3 - 2] = arguments[_key3];
      }

      return _functionBindery.find_and_run.apply(undefined, [this.routes, method, path].concat(args));
    }
  }, {
    key: 'export_routes',
    value: function export_routes(router) {
      for (var _len4 = arguments.length, routers = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        routers[_key4 - 1] = arguments[_key4];
      }

      if (!routers.length) return router.routes;

      return routers.map(function (r) {
        return r.routes;
      }).reduce(function (prev, cur) {
        return cur.mergeDeep(prev);
      }, router.routes);
    }
  }]);

  return RouteManager;
}();

exports.default = RouteManager;