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
exports.IS_ARRAY = _pathify.IS_ARRAY;

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
    key: 'export_routes',
    value: function export_routes() {
      return duplicate(this.routes);
    }
  }, {
    key: 'find',
    value: function find(method, path, body, headers, ctx) {
      var routes = arguments.length <= 5 || arguments[5] === undefined ? this.routes : arguments[5];

      return new Promise(function (resolve, reject) {
        var entry = (0, _pathify.retrieve_path)(method, path, routes);
        var params = (0, _pathify.paramify)(path, entry.path.description, entry.path.params);

        resolve((0, _pathify.execute_middleware)(entry.middleware, _pathify.IS_ARRAY, headers, params, body, ctx));
      });
    }
  }]);

  return RouteManager;
}();

exports.default = RouteManager;


function duplicate(obj) {
  return obj.asImmutable();
}