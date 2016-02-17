Installation
------------

```
npm install one-track --save
```

if intending to use with koa2

```
npm install one-track one-track-koa koa@next koa-bodyparse@3 --save
```

note that none of those are required to use this package, but they are 
used in the demonstrations below

Usage with Koa2
---------------

```js
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import RouteManager from 'one-track';
import RouteMiddleware from 'one-track-koa';

import { retrieve_user } from './your-app';

const app          = new Koa();
const Router       = new RouteManager();

Router.GET('/user/:id', retrieve_user);

app.use(bodyParser());
app.use(RouteMiddleware(Router))
```

The above code will create the routes described, and call the functions
implied with the following argument signature 

```js
(headers, params, body, app)
```

where `app` is the Koa app context. Router supports standard CRUD opperations

for example:

```js
Router.GET('/user/:id', retrieve_user);
Router.POST('/user', create_user);
Router.PUT('/user/:id', update_user);
Router.DELETE('/user/:id', delete_user);
```

Router Chaining 
---------------

Routers can be created from other Routers without disturbing the original

```js
const Router       = new RouteManager();
Router.GET('/user/:id', retrieve_user);

Router_2 = new RouteManager(Router);
Router_2.Post('/user', create_user);
```

In the above example, the Router object has 1 route (`GET '/user/:id'`), and the
`Router_2` object has 2 (`GET '/user/:id'` and `POST '/user'`);


Routed Function Context 
-----------------------

Sometimes it is important to dictate the scope that a function is called, defining
`this` for the context of the function. To do this, an array notation of `[scope, function]` 
is used. 

If the function is a string, the context is searched for the function's name

```js
Router.get('/user/:id', [user, 'find']); //=> user['find'].call(user, ...args)
```

Otherwise the function is called with the context given

```js
Router.get('/user/:id', [user, retrieve_user]); //=> retrieve_user.call(user, ...args)
```

Argument Translation 
--------------------

Argument translators can be used to map the unweildy data from the request
into something an environment-agnostic method can process

```js
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import RouteManager, { Send } from 'one-track';
import RouteMiddleware from 'one-track-koa';

import { retrieve_user } from './your-app';

// translate the arguments that come from the koa app
// into something that the retrieve_user method can understand

const koa_retrieve_user = Send((headers, params, body, app) => [params.id]).to(retrieve_user);

Router.GET('/user/:id', koa_retrieve_user);
```

This allows you to create functions that do not care about the environment that they 
ultimately live in. This also allows functions to live in multiple contexts, and for
contexts to change, without affecting the business logic

Argument translations also respond to the array notation given above

```js
Send((headers, params, body, app) => [params.id]).to([User, retrieve_user]);
```


Hello World with Koa2 
=====================

```js
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import RouteManager from '../index';
import RouteMiddleware from '../one-track-koa';

const app          = new Koa();
const Router       = new RouteManager();

function hello({place}){
console.log("in hello");
return "hello, "+place
}

function goodbye(){
console.log("in goodbye");
return "goodbye"
}

function say(phrase){
console.log("in say");
return "say "+phrase;
}

Router.GET('/hello/:place', hello);            // => hello, {place}
Router.GET('/say/hello/:place', hello, say);   // => say hello, {place}      
Router.GET('/say/goodbye', goodbye, say);      // => say goodbye
Router.GET('/goodbye', goodbye);               // => goodbye

app.use(bodyParser());
app.use(RouteMiddleware(Router))

app.listen(3000);
console.log("app is listening");
```

Authentication Middleware Example 
=================================

The two code samples below are functionally equivalent. The first simply does the job,
the second takes advantage of argument translators to abstract the request from the 
process of authentication

### Basic signature-checking authentication middleware  

```js
function simple_auth(headers, ...args){
  if(sign(headers.user_id, SECRET) !== headers.authorization) throw {code:401, message:"Unauthorized"}
  return [headers, ...args]
}
```

### Middleware example using argument translations

```js
// this is a simple signature method that should not be used in production 
const sign  = (user, secret=SECRET) => user+secret;

// step 1: translate args to a method your validation function will understand.
//         in this case we are returning the user id and auth sent in the header
//         followed by the rest of the arguments in the appropriate order
function authentication_arguments(headers, ...args){
  return [headers.user_id, headers.authorization, headers, ...args]
}

// step 2: validate the user and return the remaining arguments
function validate_authentication(user, token, ...args){
   if(sign(user, SECRET) !== token) throw {code:401, message:"Unauthorized"}
   return args
}

// step 3: create the authentication middleware by sending the proper authentication
//         arguments to the authentication checker
const authenticate = Send(authentication_arguments).to(validate_authentication);
```

### example usage of above middleware

```js
// example request headers:
//   user_id      : APPLE
//   Authorization: APPLESAUCE
R2.POST('/goodbye/:say', authenticate,
                      Send((headers, params)=>[params.say]).to(goodbye),
                      say);       
```

General Usage 
-------------

One-Track does not require a server to work. Any application which can
receive events can be routed through this software.

```js
import RouteManager, { Send, GET } from 'one-track';
const Router = new RouteManager();

Router.GET('/path/:id/other/:info', another_function);
```

In this case, calling

```js
Router.find(GET, '/path/some_id/other/text_to_send', arg1, arg2)
```

is basically equivalent to calling

```js
(function(){
return new Promise(resolve, reject){
  resolve(another_function.call(this, ...arguments));
}
})()
```

where `arg_1` and `arg_2` would be passed into `another_function`, since
they are being passed in through the final arguments send in with `Router.find`.
So, the koa middleware really ends up being as simple as setting the body of 
the response to the result of the request path's function, with the relevant 
info of the body, headers, and Koa context passed in as arguments

### one-track-koa middleware

```js
const middleware = (Router) => async (ctx, next) => {
  ctx.body = await Router
                    .find(ctx.method, ctx.path, ctx.request.body, ctx.headers, ctx)
                    .catch((err) => {
                      console.log(err.stack||err);
                      ctx.status = err.code||ctx.status;
                      return err;
                    });
}
export default middleware
```
