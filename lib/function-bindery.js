export function run(func, ...args){
  return new Promise(function(resolve, reject){
    const ctx = func[0];
    const result = (func[1]||func).call(ctx, ...args);
    resolve(result)
  })
}

export function Send(arg_map){
  return {
    to: function(func){
      return function(){
        const map_resolution = new Promise((resolve, reject)=>
                                      resolve(arg_map(...arguments)))
        return map_resolution.then((result) => func(...result))
      }
    }
  }
}

export function execute_middleware(function_array, ...args){
  const func_list = new List(function_array);
  if(func_list.isEmpty()) return args[0];
  const func = func_list.first();
  const remaining_functions = func_list.shift();
  return run(func, ...args)
          .then((result) => {
            if(!Array.isArray(result)) result = [result];
            return execute_middleware(remaining_functions, ...result)
          });
     
}
