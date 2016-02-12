'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lib = require('./lib');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RouteManager = function () {
  function RouteManager() {
    var router = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

    _classCallCheck(this, RouteManager);

    if (router) this.routes = router.export_routes();
  }

  _createClass(RouteManager, [{
    key: 'GET',
    value: function GET() {
      return this.new_route.apply(this, [_lib.GET].concat(Array.prototype.slice.call(arguments)));
    } // define RouteManager.GET

  }, {
    key: 'POST',
    value: function POST() {
      return this.new_route.apply(this, [_lib.POST].concat(Array.prototype.slice.call(arguments)));
    } // define RouteManager.POST

  }, {
    key: 'PUT',
    value: function PUT() {
      return this.new_route.apply(this, [_lib.PUT].concat(Array.prototype.slice.call(arguments)));
    } // define RouteManager.PUT

  }, {
    key: 'DELETE',
    value: function DELETE() {
      return this.new_route.apply(this, [_lib.DELETE].concat(Array.prototype.slice.call(arguments)));
    } // define RouteManager.DELETE

  }, {
    key: 'new_route',
    value: function new_route(method) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this.routes = _lib.add_route.apply(undefined, [this.routes, method].concat(args)); // append a route to this instance's routes
      return this; // allow this method to be chained
    }
  }, {
    key: 'export_routes',
    value: function export_routes() {
      return (0, _lib.duplicate)(this);
    }
  }, {
    key: 'find',
    value: function find(method, path, body, headers, ctx) {
      var routes = arguments.length <= 5 || arguments[5] === undefined ? this.routes : arguments[5];

      return new Promise(function (resolve, reject) {
        // always return a promise
        var entry = (0, _lib.retrieve_path)(method, path, routes); // find the path's executable function and data
        var params = (0, _lib.paramify)(path, entry.path.description, // retrieve the parameters for the given path
        entry.path.params); // given the path description (regex) and params
        // found above
        var args = Object.assign({}, body, params);

        resolve((0, _lib.execute_middleware)(entry.middleware, // run the code associated with the route
        args, // resolve the promise with whatever it returns
        headers, ctx));
      }); // end return
    } // end `find`

  }]);

  return RouteManager;
}(); // end class


exports.default = RouteManager;