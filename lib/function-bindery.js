import { List } from 'immutable';

export const IS_ARRAY = true;
export const NO_SUCH_ROUTE = { code: 404, msg: 'NO SUCH ROUTE' };

export function Send(arg_map){
  return {
    to: function(func){
      return function(){
        const map_resolution = new Promise((resolve, reject)=>
                                      resolve(arg_map(...arguments)))
        return map_resolution.then((result) => run(func, ...result))
      }
    }
  }
}


export function find_and_run(routes, method, path, ...args){
  return new Promise(function(resolve, reject){        
    const entry  = retrieve_path(method, path, routes);  
    const params = paramify(path,
                            entry.path.description,     
                            entry.path.params);        
                                                      

    resolve(execute_middleware(entry.middleware,     
                               IS_ARRAY,
                               params,
                               ...args
                               ));
  });
}

function retrieve_path(method, path, routes){
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

function paramify(path, description, params){
  const vals = path.match(new RegExp(description)).map(x=>x);
  return objectify(params, vals.slice(1, vals.length));
}

function objectify (keys, values) {
  let obj = {};
  for (var index in keys){
    obj[keys[index]] = values[index];
  }
  return obj;
}

function run(func, ...args){
  return new Promise(function(resolve, reject){
    const ctx = func[0]||args[args.length-1];
    const result = (func[1]||func).call(ctx, ...args);
    resolve(result)
  })
}

function execute_middleware(function_array, isArray, ...args){
  const func_list = new List(function_array);
  if(func_list.isEmpty()) return isArray?args:args[0];
  const func = func_list.first();
  const remaining_functions = func_list.shift();
  return run(func, ...args)
          .then((result) => {
            const result_is_array = Array.isArray(result)?IS_ARRAY:false;
            if(result_is_array===IS_ARRAY){
              return execute_middleware(remaining_functions, result_is_array, ...result)
            }else{
              return execute_middleware(remaining_functions, result_is_array, result)
            }
          });
}
