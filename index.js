import { 
   GET,
   POST,
   PUT,
   DELETE,
   paramify,
   retrieve_path,
   add_route,
   execute_middleware
 }   from './lib';

export default class RouteManager {
  constructor(router=undefined){
    if(router && typeof router.dup === "function") this.routes = router.dup();
  }
                                                               
  GET()    { return this.new_route(GET,    ...arguments); }    // define RouteManager.GET
  POST()   { return this.new_route(POST,   ...arguments); }    // define RouteManager.POST
  PUT()    { return this.new_route(PUT,    ...arguments); }    // define RouteManager.PUT
  DELETE() { return this.new_route(DELETE, ...arguments); }    // define RouteManager.DELETE
  
  new_route(method, ...args) {                                
    this.routes = add_route(this.routes, method, ...args);     // append a route to this instance's routes
    return this;                                               // allow this method to be chained 
  }

  dup(){
    return this.routes.asImmutable();
  }

  find(method, path, body, headers, ctx, routes=this.routes){
    return new Promise(function(resolve, reject){              // always return a promise
      const entry  = retrieve_path(method, path, routes);      // find the path's executable function and data
      const params = paramify(path,
                              entry.path.description,          // retrieve the parameters for the given path
                              entry.path.params);              // given the path description (regex) and params 
                                                               // found above
      const args   = Object.assign({}, body, params);

      resolve(execute_middleware(entry.middleware,             // run the code associated with the route
                                 args,                         // resolve the promise with whatever it returns
                                 headers,
                                 ctx));
    });                                                        // end return
  }                                                            // end `find`

}                                                              // end class 
