import RouteManager, { GET, POST, PUT, DELETE } from '../index';
const chai = require('chai');
const expect = chai.expect;


describe("chaining a router", ()=>{
  let Router, Router2;
  beforeEach(()=>{
    Router = new RouteManager();
    Router = Router.GET('/hello', ()=>'hello');
    Router2 = new RouteManager(Router);
  })
  afterEach(()=>{
    Router = new RouteManager();
    Router2 = new RouteManager();
  })
  it("should yeild an equivalent router", ()=>{
    expect(Router.routes).to.equal(Router2.routes);
  })
  describe("chaining many routers", ()=>{
    let Router3, ChainedRouter;
    beforeEach(()=>{
      Router = new RouteManager().GET('/hello', ()=>'hello');
      Router2 = new RouteManager().GET('/goodbye', ()=>'goodbye');
      Router3 = new RouteManager().GET('/sit', ()=>'sit');
      ChainedRouter = new RouteManager(Router, Router2, Router3)
    })
    it("the router created from all other routers should have the first route", (done)=>{
      ChainedRouter.find('GET', '/hello')
        .then((result)=>{
          expect(result).to.equal('hello');
        })
        .then(done)
        .catch(done)
    })
    it("the router created from all other routers should have the second route", (done)=>{
      ChainedRouter.find('GET', '/goodbye')
        .then((result)=>{
          expect(result).to.equal('goodbye');
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
  })
})
