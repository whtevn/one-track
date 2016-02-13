
    import Koa from 'koa';
    import bodyParser from 'koa-bodyparser';
    import RouteManager from '../index';
    import RouteMiddleware from '../one-track-koa';

    const app          = new Koa();
    const Router       = new RouteManager();

    function hello(place){
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


    const routed_hello = {args: (params) => params.place, func: hello};
    Router.GET('/hello/:place', routed_hello);       
    Router.GET('/say/hello/:place', routed_hello, say);       

    const R2 = new RouteManager(Router)


    /*
    Send((params, body) => body.phrase).to(goodbye),
    Send((params, body) => body.phrase).to([ctx, goodbye]),

    const authentication_arguments = (params, body, headers, ctx) => [(params.user_id||headers.user_id), headers.Authenticate, params]
    const validate_authentication  = (token, params) => check(token) && params
    const check = (token) => true

    const authenticate = Send(authentication_arguments).to(validate_authentication);
    R2.POST('/say/goodbye', authenticate,
                            goodbye,
                            say);       
    */

    app.use(bodyParser());
    app.use(RouteMiddleware(R2))

    app.listen(3000);
    console.log("app is listening");
