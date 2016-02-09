import {Map} from 'immutable';
import { objectify, regexify, routify } from './lib';

const escapeStringRegexp = require('escape-string-regexp');

const INITIAL_ROUTES = Map({GET:Map({}), POST:Map({}), PUT:Map({}), DELETE:Map({})});
const GET    = 'GET'   ;
const POST   = 'POST'  ;
const PUT    = 'PUT'   ;
const DELETE = 'DELETE';

const NO_SUCH_ROUTE = { code: 404, msg: 'NO SUCH ROUTE' };

export default class RouteManager {
  constructor(opts){
    this.routes = routify();
  }


  add_route(method, path, classname, func){
    const new_path = regexify(path);
    this.routes = routify(this.routes, method, 
                              {path: new_path, route: {classname, func}})
  }

  GET()    { this.add_route(GET    , ...arguments); }
  POST()   { this.add_route(POST   , ...arguments); }
  PUT()    { this.add_route(PUT    , ...arguments); }
  DELETE() { this.add_route(DELETE , ...arguments); }

  find(method, path, body){
    const route_opts = this.routes
                      .get(method)
                      .filter(
                        (val, test) => {
                          return path.match(new RegExp(test))
                        }
                      )

    const entry = route_opts.first();

    if(!entry) throw NO_SUCH_ROUTE

    const vals = path.match(new RegExp(entry.path.description)).map(x=>x);
    const params = objectify(entry.path.params, vals.slice(1, vals.length));

    return entry.route.classname[entry.route.func](Object.assign({}, body, params));
  }

}
