
    import Koa from 'koa';
    import bodyParser from 'koa-bodyparser';
    import RouteManager, { Send } from '../index';
    import RouteMiddleware from '../one-track-koa/index';

    const app    = new Koa();
    const Router = new RouteManager();


    /****** Imagine... that this is your app *******/
    function hello(place){
      return "hello, "+place
    }

    function goodbye(to){
      return "goodbye "+to
    }

    function say(phrase){
      return ["say ", phrase];
    }
    /********** end of your imaginary app*********/

    /*** SAMPLE AUTHENTICATION MIDDLEWARE ***/

      // this is a simple signature method that should not be used in production 
      const sign  = (user, secret=SECRET) => user+secret;

      // step 1: translate args to a method your validation function will understand.
      //         in this case we are returning the user id and auth sent in the header
      //         followed by the rest of the arguments in the appropriate order
      function authentication_arguments(params, headers, ...args){
        return [headers.user_id, headers.authorization, params, headers, ...args]
      }

      // step 2: validate the user and return the remaining arguments
      function validate_authentication(user, token, ...args){
         if(sign(user, SECRET) !== token) throw {code:401, message:"Unauthorized"}
         return args
      }

      // step 3: create the authentication middleware by sending the proper authentication
      //         arguments to the authentication checker
      const authenticate = Send(authentication_arguments).to(validate_authentication);


    /***************************************/
      // NOTE: very little of the above is actually required. The following function `simple_auth`
      //       and the constant `authenticate` created above are functionally equivalent.
      //       the advantage of the `authenticate` constant being that the algorithm is not 
      //       tied to the request-related arguments as they are sent
      function simple_auth(params, headers, ...args){
        if(sign(headers.user_id, SECRET) !== headers.authorization) throw {code:401, message:"Unauthorized"}
        return [params, headers, ...args]
      }
    /***************************************/



    const SECRET = 'SAUCE'


    const hello_params = (params) => [params.place];
    const routed_hello = Send(hello_params).to(hello);

    Router.GET('/hello/:place', routed_hello);       
    Router.GET('/say/hello/:place', routed_hello, say);       

    const R2 = new RouteManager(Router)

    // example request headers:
    //   user_id      : APPLE
    //   Authorization: APPLESAUCE
    R2.POST('/goodbye/:say', authenticate,
                            Send((params)=>[params.say]).to(goodbye),
                            say);       

    // example request headers:
    //   user_id      : APPLE
    //   Authorization: APPLESAUCE
    R2.POST('/goodbye', simple_auth,
                        Send(()=>['']).to(goodbye));       


    app.use(bodyParser());
    app.use(RouteMiddleware(R2))

    app.listen(3000);
    console.log("app is listening");




