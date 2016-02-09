
export function objectify (keys, values) {
  let obj = {};
  for (var index in keys){
    obj[keys[index]] = values[index];
  }
  return obj;
}

export function regexify(path){
  const regex = new RegExp(/:([^\/]*)/,'g')
  return {
    params: (path.match(regex)||[]).map(x => x.replace(':', '')),
    description: escapeStringRegexp(path).replace(regex, "([^\\/]*)")+"/?$"
  }
}

export function Set_Routes(routes=INITIAL_ROUTES, method=GET, opts={}) {
  return opts.path ?  routes.setIn([method, opts.path.description], opts) : routes
}


