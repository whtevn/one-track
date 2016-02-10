"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var middleware = function middleware(Router) {
  return function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return Router.find(ctx.method, ctx.path, ctx.request.body, ctx.headers).catch(function (err) {
                console.log(err.stack);
                ctx.status = err.code || ctx.status;
                return err;
              });

            case 2:
              ctx.body = _context.sent;

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })),
        _this = undefined;

    return function (_x, _x2) {
      return ref.apply(_this, arguments);
    };
  }();
};
exports.default = middleware;