import { 
   GET,
   POST,
   PUT,
   DELETE,
   NO_SUCH_ROUTE,
   objectify,
   regexify,
   routify,
   paramify 
 }   from './lib';

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
    const entry = this.routes
                      .get(method)
                      .filter(
                        (val, test) => {
                          return path.match(new RegExp(test))
                        }
                      ).first();

    if(!entry) throw NO_SUCH_ROUTE

    const params = paramify(path, entry.path.description, entry.path.params)

    return entry.route.classname[entry.route.func](Object.assign({}, body, params));
  }

}
