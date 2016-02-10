Installation
------------

    npm install one-track --save

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


Using with Koa2 
===============

    import RouteManager    from 'one-track';
    import RouteMiddleware from 'one-track/koa.middleware';

    const Router = new RouteManager();

    import User from './src/user';

    UserSingleton = new User();

    Router.POST('/path/to/login', app, UserSingleton.signon); 

    Router.GET('/path/to/:id', UserSingleton, 'find');       

    app.use(bodyParser());
    app.use(RouteMiddleware(Router))

    app.listen(3000);
    console.log("app is listening");


More Examples 
=============

    const Koa = require('koa');
    const bodyParser = require('koa-bodyparser');

    import RouteManager from './lib/router';
    import RouteMiddleware from './lib/router.koa.middleware';

    import User from './src/user/core.user';
    import * as User_Adapter from './src/user/lib.user';

    const UserInstance = new User({User_Adapter})
    const app          = new Koa();
    const Router       = new RouteManager();

    Router
      .POST('/register', UserInstance, 'register')
      .POST('/login', UserInstance, 'login')

    const RouterCont  = new RouteManager(Router)
                          .GET('/user/:id', UserInstance, 'locate')
                          .GET('/user/:id/test/:second', UserInstance, 'locate')
                          .GET('/user/:id/test/:second/:third', UserInstance, 'locate')

    app.use(bodyParser());
    app.use(RouteMiddleware(RouterCont))

    app.listen(3000);
    console.log("app is listening");

