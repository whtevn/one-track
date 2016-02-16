const Binder = {
  run(func, ...args){
    return new Promise(function(resolve, reject){
      const ctx = func[0];
      const result = (func[1]||func).call(ctx, ...args);
      resolve(result)
    })
  },

  send(arg_map){
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
}

export default Binder
