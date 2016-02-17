'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IS_ARRAY = exports.DELETE = exports.PUT = exports.POST = exports.GET = exports.Send = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functionBindery = require('./lib/function-bindery');

Object.defineProperty(exports, 'Send', {
  enumerable: true,
  get: function get() {
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
    var router = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

    _classCallCheck(this, RouteManager);

    if (router) this.routes = router.export_routes();
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
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this.routes = _pathify.add_route.apply(undefined, [this.routes, method].concat(args));
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
  }, {
    key: 'export_routes',
    value: function export_routes() {
      return duplicate(this.routes);
    }
  }]);

  return RouteManager;
}();

exports.default = RouteManager;


function duplicate(obj) {
  return obj.asImmutable();
}