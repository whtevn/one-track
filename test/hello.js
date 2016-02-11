
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

    Router.GET('/hello/:place', hello);       
    Router.GET('/say/hello/:place', hello, say);       
    Router.GET('/say/goodbye', goodbye, say);       

    app.use(bodyParser());
    app.use(RouteMiddleware(Router))

    app.listen(3000);
    console.log("app is listening");


