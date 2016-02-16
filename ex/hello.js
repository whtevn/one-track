
    import Koa from 'koa';
    import bodyParser from 'koa-bodyparser';
    import RouteManager from '../index';
    import RouteMiddleware from '../one-track-koa';


    // TODO: this  needs to be exportable from one-track
    import Binder from '../lib/function-bindery';


    const app    = new Koa();
    const Router = new RouteManager();
    const Send   = Binder.send;

    function hello(place){
      console.log("in hello");
      return "hello, "+place
    }

    function goodbye(to){
      console.log("in goodbye", to);
      return "goodbye "+to
    }

    function say(phrase){
      console.log("in say");
      return "say "+phrase;
    }

    const hello_params = (headers, params) => [params.place];
    const routed_hello = Send(hello_params).to(hello);

    Router.GET('/hello/:place', routed_hello);       
    Router.GET('/say/hello/:place', routed_hello, say);       

    const R2 = new RouteManager(Router)


    const SECRET = 'SAUCE'


    /*** SAMPLE AUTHENTICATION MIDDLEWARE ***/

    // step 1: translate args to a method your validation function will understand
    const authentication_arguments = (headers, ...args) => 
      // in this case we are returning the user id and auth sent in the header
      // followed by the rest of the arguments in the appropriate order
      [headers.user_id, headers.authorization, headers, ...args]

    // step 2: validate the user and return the remaining arguments
    const validate_authentication  = (user, token, ...args) => check(user, token, SECRET) && args

    // this method is broken out from the validation function, but could be written in line
    // if this was not needed elsewhere
    const check = (user, token, secret) => sign(user, secret) === token

    // this is a simple signature method that should not be used in production 
    const sign  = (user, secret=SECRET) => user+secret;


    // step 3: create the authentication middleware by sending the proper authentication
    //         arguments to the authentication checker
    const authenticate = Send(authentication_arguments).to(validate_authentication);

    // example request headers:
    //   user_id      : APPLE
    //   Authorization: APPLESAUCE
    R2.POST('/goodbye/:say', authenticate,
                            Send((headers, params)=>[params.say]).to(goodbye),
                            say);       

    /***************************************/

    app.use(bodyParser());
    app.use(RouteMiddleware(R2))

    app.listen(3000);
    console.log("app is listening");
