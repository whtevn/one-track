import { Map } from 'immutable';
const escapeStringRegexp = require('escape-string-regexp');

export const INITIAL_ROUTES = Map({GET:Map({}), POST:Map({}), PUT:Map({}), DELETE:Map({})});


export const GET    = 'GET'   ;
export const POST   = 'POST'  ;
export const PUT    = 'PUT'   ;
export const DELETE = 'DELETE';
export const BAD_ROUTER    = new Error("bad router given in generator");

const DUPLICATE_ROUTE = (method, path)=> new Error(`DUPLICATED ROUTE: ${method} ${path}`);

export function add_route(routes, method, path, ...func_set){
  if(typeof path === 'string') path = { path: regexify(path), middleware: func_set }

  return routify(routes,
                 method, 
                 path
                );
}

function routify(routes=INITIAL_ROUTES, method=GET, opts={}) {
  if(opts.path && routes.getIn([method, opts.path.description])) throw DUPLICATE_ROUTE(method, opts.path.description);

  return opts.path ? 
           routes.setIn([method, opts.path.description], opts) :
           routes
}

function regexify(path){
  if(!path.match(/^\//)) path = `/${path}`;
  if(path.match(/\/$/)) path = path.slice(0, -1);
  const regex = new RegExp(':([^\\/]*)','g');
  return {
    path: path,
    params: (path.match(regex)||[]).map(x => x.replace(':', '')),
    description: "^"+escapeStringRegexp(path).replace(regex, "([^\\/]*)")+"/?$"
  }
}

export function new_route(routes, method, ...args) {                                
  try {
    routes = add_route(routes, method, ...args); 
  } catch (err) {
    console.log(err);
  }
  return routes;                                          
}

export function combine_routers(...routers){
  return routers.reduce((prev, cur) => add_batch(prev, cur.routes), routers[0].routes);
}

function add_batch(routes=INITIAL_ROUTES, new_router=INITIAL_ROUTES){
  const new_routes = new_router.reduce((prev, cur, method) => {
    return [...prev, ...cur.reduce((p,c,i)=>{
      return [...p, {method:method,regex:i,path:c}]
    }, [])]
  }, [])
  return add_routes(routes, ...new_routes);
}

function add_routes(routes, route, ...remaining_routes){
  if(route===undefined) return routes;
  const added_routes = remaining_routes.empty?  routes : add_routes(routes, ...remaining_routes);
  return new_route(added_routes, route.method, route.path);
}

