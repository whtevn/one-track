import { 
   GET,
   POST,
   PUT,
   DELETE,
   add_route
 }   from './lib/pathify';

import {
   IS_ARRAY,
   find_and_run
} from './lib/function-bindery';

export { Send } from './lib/function-bindery';
export { GET, POST, PUT, DELETE, IS_ARRAY }  ;

export default class RouteManager {
  constructor(...routers){
    this.routes = this.export_routes(this, ...routers);
  }
                                                               
  GET()    { return this.new_route(GET,    ...arguments); }   
  POST()   { return this.new_route(POST,   ...arguments); }    
  PUT()    { return this.new_route(PUT,    ...arguments); }  
  DELETE() { return this.new_route(DELETE, ...arguments); } 
  
  new_route(method, ...args) {                                
    this.routes = add_route(this.routes, method, ...args); 
    return this;                                          
  }

  find(method, path, ...args){
    return find_and_run(this.routes, method, path, ...args);
  }

  export_routes(router, ...routers){
    if(!routers.length) return router.routes

    return routers.map(r=>r.routes)
                  .reduce((prev, cur) => cur.mergeDeep(prev), router.routes)
  }
} 
