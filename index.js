import { 
   GET,
   POST,
   PUT,
   DELETE,
   paramify,
   retrieve_path,
   add_route,
   execute_middleware,
 }   from './lib/pathify';


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

  export_routes(){
    return duplicate(this.routes);
  }

  find(method, path, body, headers, ctx, routes=this.routes){
    return new Promise(function(resolve, reject){        
      const entry  = retrieve_path(method, path, routes);  
      const params = paramify(path,
                              entry.path.description,     
                              entry.path.params);        
                                                        

      resolve(execute_middleware(entry.middleware,     
                                 headers,             
                                 params,
                                 body,
                                 ctx));
    });                                              
  }                                                 

}                                                  
export { Send } from './lib/function-bindery';

function duplicate(obj){
  return obj.asImmutable();
}
