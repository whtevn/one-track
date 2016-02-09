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

    import RouteManager from 'one-track';
    const Router = new RouteManager();

    import User from './src/user';

    UserSingleton = new User();

    Router.POST('/path/to/login', app, UserSingleton.signon); 

    Router.GET('/path/to/:id', UserSingleton, 'find');       

    app.use(bodyParser());
    app.use(async (ctx, next) => {
      ctx.body = await Router
                        .find(ctx.method, ctx.path, ctx.request.body)
                        .catch((err) => {
                          console.log('error caught');
                          ctx.status = err.code||ctx.status;
                          return err;
                        });
    })

    app.listen(3000);
    console.log("app is listening");
