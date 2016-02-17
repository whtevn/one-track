import { 
   GET,
   POST,
   PUT,
   DELETE,
   paramify,
   retrieve_path,
   add_route,
 }   from './lib/pathify';

import {
   IS_ARRAY,
   execute_middleware,
   find_and_run
} from './lib/function-bindery';

export { Send } from './lib/function-bindery';
export { GET, POST, PUT, DELETE, IS_ARRAY }  ;

export default class RouteManager {
  constructor(router=undefined){
    if(router) this.routes = router.export_routes();
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

  export_routes(){
    return duplicate(this.routes);
  }

} 


function duplicate(obj){
  return obj.asImmutable();
}
