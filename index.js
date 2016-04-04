import { 
   GET,
   POST,
   PUT,
   DELETE,
   new_route,
   combine_routers
 }   from './lib/pathify';

import {
   IS_ARRAY,
   find_and_run
} from './lib/function-bindery';

export { Send } from './lib/function-bindery';
export { GET, POST, PUT, DELETE, IS_ARRAY }  ;

export default class RouteManager {
  constructor(...routers){
    this.routes = combine_routers(this, ...routers);
  }
                                                               
  GET()    { 
    this.routes = new_route(this.routes, GET, ...arguments); 
    return this;
  }   
  POST()   {
    this.routes = new_route(this.routes, POST,...arguments);
    return this;
  }    
  PUT()    {
    this.routes = new_route(this.routes, PUT, ...arguments);
    return this;
  }  
  DELETE() {
    this.routes = new_route(this.routes, DELETE, ...arguments); 
    return this;
  } 

  find(method, path, ...args){
    return find_and_run(this.routes, method, path, ...args);
  }

} 

