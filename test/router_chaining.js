import RouteManager, { GET, POST, PUT, DELETE } from '../index';
const chai = require('chai');
const expect = chai.expect;


describe("chaining a router", ()=>{
  let Router, Router2;
  beforeEach(()=>{
    Router = new RouteManager();
    Router = Router.GET('/hello', ()=>'hello');
    Router = Router.GET('/goodbye', ()=>'goodbye');
    Router = Router.GET('/sit', ()=>'sit');
    Router2 = new RouteManager(Router);
  })
  afterEach(()=>{
    Router = new RouteManager();
    Router2 = new RouteManager();
  })
  it("should yeild an equivalent router", ()=>{
    expect(Router.routes.toJS).to.deep.equal(Router2.routes.toJS);
  })

  describe("chaining many routers", ()=>{
    let Router3, ChainedRouter;
    beforeEach(()=>{
      Router = new RouteManager().GET('/hello', ()=>'hello');
      Router = Router.GET('/two', ()=>'hello');
      Router2 = new RouteManager().GET('/goodbye', ()=>'goodbye');
      Router2 = Router2.GET('/neat', ()=>'neat');
      Router3 = new RouteManager().GET('/sit', ()=>'sit');
      ChainedRouter = new RouteManager(Router, Router2, Router3)
    })
    afterEach(()=>{
      Router = new RouteManager();
      Router2 = new RouteManager();
      Router3 = new RouteManager();
      ChainedRouter = new RouteManager();
    })
    it("the router created from all other routers should have the first route", (done)=>{
      ChainedRouter.find('GET', '/hello')
        .then((result)=>{
          expect(result).to.equal('hello');
        })
        .then(done)
        .catch(done)
    })
    it("the router created from all other routers should have the second route from the first router", (done)=>{
      ChainedRouter.find('GET', '/sit')
        .then((result)=>{
          expect(result).to.equal('sit');
        })
        .then(done)
        .catch(done)
    })
    it("the router created from all other routers should have the first route from the second router", (done)=>{
      ChainedRouter.find('GET', '/goodbye')
        .then((result)=>{
          expect(result).to.equal('goodbye');
        })
        .then(done)
        .catch(done)
    })
    it("the router created from all other routers should have the second route from the second router", (done)=>{
      ChainedRouter.find('GET', '/neat')
        .then((result)=>{
          expect(result).to.equal('neat');
        })
        .then(done)
        .catch(done)
    })
    it("the router created from all other routers should have the third route", (done)=>{
      ChainedRouter.find('GET', '/sit')
        .then((result)=>{
          expect(result).to.equal('sit');
        })
        .then(done)
        .catch(done)
    })
    describe("with conflicting routes", ()=>{
      beforeEach(()=>{
        Router = new RouteManager().GET('/hello', ()=>'first');
        Router2 = new RouteManager().GET('/hello', ()=>'second');
        Router3 = new RouteManager().GET('/hello', ()=>'third');
        ChainedRouter = new RouteManager(Router, Router2, Router3)
      })
      afterEach(()=>{
        Router = new RouteManager();
        Router2 = new RouteManager();
        Router3 = new RouteManager();
        ChainedRouter = new RouteManager();
      })
      it("the router created from all other routers should have the first route", (done)=>{
        ChainedRouter.find('GET', '/hello')
          .then((result)=>{
            expect(result).to.equal('first');
          })
          .then(done)
          .catch(done)
      })
    })
  })
})
