import { Map } from 'immutable';
const escapeStringRegexp = require('escape-string-regexp');

export const INITIAL_ROUTES = Map({GET:Map({}), POST:Map({}), PUT:Map({}), DELETE:Map({})});

export const GET    = 'GET'   ;
export const POST   = 'POST'  ;
export const PUT    = 'PUT'   ;
export const DELETE = 'DELETE';
export const NO_SUCH_ROUTE = { code: 404, msg: 'NO SUCH ROUTE' };

function objectify (keys, values) {
  let obj = {};
  for (var index in keys){
    obj[keys[index]] = values[index];
  }
  return obj;
}

function regexify(path){
  const regex = new RegExp(/:([^\/]*)/,'g')
  return {
    params: (path.match(regex)||[]).map(x => x.replace(':', '')),
    description: escapeStringRegexp(path).replace(regex, "([^\\/]*)")+"/?$"
  }
}

function routify(routes=INITIAL_ROUTES, method=GET, opts={}) {
  return opts.path ? 
           routes.setIn([method, opts.path.description], opts) :
           routes
}

export function paramify(path, description, params){
  const vals = path.match(new RegExp(description)).map(x=>x);
  return objectify(params, vals.slice(1, vals.length));
}


export function add_route(routes, method, path, classname, func=''){
  if(typeof func === 'string') func = classname[func];

  const path_regex_and_description = regexify(path);
  routes = routify(routes,
                     method, 
                    { path: path_regex_and_description,
                      route: {classname, func}
                    });
  return routes
}

export function retrieve_path(method, path, routes){
    const entry = routes
                    .get(method)
                    .filter(
                      (val, test) => {
                        return path.match(new RegExp(test))
                      }
                    ).first();
    if(!entry) throw NO_SUCH_ROUTE;
    return entry;

}
