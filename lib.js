import { Map } from 'immutable';
const escapeStringRegexp = require('escape-string-regexp');

export const INITIAL_ROUTES = Map({GET:Map({}), POST:Map({}), PUT:Map({}), DELETE:Map({})});

export const GET    = 'GET'   ;
export const POST   = 'POST'  ;
export const PUT    = 'PUT'   ;
export const DELETE = 'DELETE';
export const NO_SUCH_ROUTE = { code: 404, msg: 'NO SUCH ROUTE' };

export function objectify (keys, values) {
  let obj = {};
  for (var index in keys){
    obj[keys[index]] = values[index];
  }
  return obj;
}

export function regexify(path){
  const regex = new RegExp(/:([^\/]*)/,'g')
  return {
    params: (path.match(regex)||[]).map(x => x.replace(':', '')),
    description: escapeStringRegexp(path).replace(regex, "([^\\/]*)")+"/?$"
  }
}

export function routify(routes=INITIAL_ROUTES, method=GET, opts={}) {
  return opts.path ?  routes.setIn([method, opts.path.description], opts) : routes
}

export function paramify(path, description, params){
  const vals = path.match(new RegExp(description)).map(x=>x);
  return objectify(params, vals.slice(1, vals.length));
}

