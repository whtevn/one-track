import { Map } from 'immutable';
const escapeStringRegexp = require('escape-string-regexp');

export const INITIAL_ROUTES = Map({GET:Map({}), POST:Map({}), PUT:Map({}), DELETE:Map({})});

export const GET    = 'GET'   ;
export const POST   = 'POST'  ;
export const PUT    = 'PUT'   ;
export const DELETE = 'DELETE';
export const BAD_ROUTER    = new Error("bad router given in generator");

export function duplicate(obj){
  return obj.asImmutable();
}

export function add_route(routes, method, path, ...func_set){
  return routify(routes,
                 method, 
                  { path: regexify(path),
                    middleware: func_set
                  }
                );
}


function routify(routes=INITIAL_ROUTES, method=GET, opts={}) {
  return opts.path ? 
           routes.setIn([method, opts.path.description], opts) :
           routes
}

function regexify(path){
  const regex = new RegExp(':([^\\/]*)','g');
  return {
    params: (path.match(regex)||[]).map(x => x.replace(':', '')),
    description: "^"+escapeStringRegexp(path).replace(regex, "([^\\/]*)")+"/?$"
  }
}
