import { List, Map } from 'immutable';
const escapeStringRegexp = require('escape-string-regexp');

export const INITIAL_ROUTES = Map({GET:Map({}), POST:Map({}), PUT:Map({}), DELETE:Map({})});

export const GET    = 'GET'   ;
export const POST   = 'POST'  ;
export const PUT    = 'PUT'   ;
export const DELETE = 'DELETE';
export const NO_SUCH_ROUTE = { code: 404, msg: 'NO SUCH ROUTE' };
export const BAD_ROUTER    = new Error("bad router given in generator");

function objectify (keys, values) {
  let obj = {};
  for (var index in keys){
    obj[keys[index]] = values[index];
  }
  return obj;
}

export function duplicate(obj){
  if(!obj.routes || !typeof obj.routes.asImmutable === 'function')
     throw BAD_ROUTER

  return obj.routes.asImmutable();
}

function regexify(path){
  const regex = new RegExp(/:([^\/]*)/,'g')
  return {
    params: (path.match(regex)||[]).map(x => x.replace(':', '')),
    description: "^"+escapeStringRegexp(path).replace(regex, "([^\\/]*)")+"/?$"
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


export function add_route(routes, method, path, ...func_set){
  return routify(routes,
                 method, 
                  { path: regexify(path),
                    middleware: func_set
                  }
                );
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

export function execute_middleware(function_array, args, headers, ctx){
  const func_list = new List(function_array);
  if(func_list.isEmpty()) return args;
  const func = func_list.first();
  const remaining_functions = func_list.shift();
  return run_fun(func, args, headers, ctx)
          .then((result) => execute_middleware(remaining_functions, result, headers, ctx));
     
}

function run_fun(func, args, headers, ctx){
  return new Promise(function(resolve, reject){
    if(typeof func === 'array'){
       ctx = func[0];
       if(typeof func[1] === 'string') func = func[0][func[1]];
       if(typeof func[1] === 'function') func = func[1];
    }
    resolve(func.call(ctx, args, headers))
  })
}
