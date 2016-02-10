Installation
------------

    npm install one-track --save

if intending to use with koa2

    npm install one-track one-track-koa koa@next --save

Usage 
-----

    import RouteManager from 'one-track';
    const Router = new RouteManager();

    Router.POST('/path/description', Function_Owner, 'function_name');
    Router.GET('/path/:id/other/:info', context, function_container);


ex:


    import RouteManager from 'one-track';
    const Router = new RouteManager();

    import User from './src/user';

    UserSingleton = new User();

    Router.POST('/path/to/login', app, UserSingleton.signon); //=> calls UserSingleton.signon with `app` as context

    Router.GET('/path/to/:id', UserSingleton, 'find');        //=> calls UserSingleton.find with `UserSingleton` as context


Hello World with Koa2 
=====================

    import Koa from 'koa';
    import bodyParser from 'koa-bodyparser';
    import RouteManager from 'one-track';
    import RouteMiddleware from 'one-track-koa';

    const app          = new Koa();
    const Router       = new RouteManager();

    function hello({place}){
      return "hello, "+place
    }

    Router.GET('/hello/:place', app, hello);       

    app.use(bodyParser());
    app.use(RouteMiddleware(Router))

    app.listen(3000);
    console.log("app is listening");


More Examples 
=============

    /* Setup the Koa app */
    import Koa from 'koa';
    import bodyParser from 'koa-bodyparser';
    const app          = new Koa();

    /* One of many ways to get a batch of functions to call from routes */
    import User from './src/user/core.user';
    import * as User_Adapter from './src/user/lib.user';
    const UserInstance = new User({User_Adapter})

    /* Set up one-track router and associated koa middleware*/
    import RouteManager from 'one-track';
    import RouteMiddleware from 'one-track-koa';
    const Router       = new RouteManager();

    /* Assign routes to the router */
    Router
      .POST('/register', UserInstance, 'register')
      .POST('/login', UserInstance, 'login')

    /* Create a new RouteManager from an old one */
    const RouterCont  = new RouteManager(Router)
                              .GET('/user/:id', UserInstance, 'locate')
                              .GET('/user/:id/test/:second', UserInstance, 'locate')
                              .GET('/user/:id/test/:second/:third', UserInstance, 'locate')


    /* bodyparser is required for POST bodies */
    app.use(bodyParser());

    /* apply the router to koa using the middleware */
    app.use(RouteMiddleware(RouterCont))

    /* listen and wait */
    app.listen(3000);
    console.log("app is listening");
