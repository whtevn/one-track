import RouteManager, { GET, POST, PUT, DELETE } from '../index';
const chai = require('chai');
const expect = chai.expect;


describe("the Router", ()=>{
  let Router;
  beforeEach(()=>{
    Router = new RouteManager();
  })
  it("should have a method for adding a GET route", ()=>{
    expect(Router.GET).to.be.a('function');
  })
  it("should have a method for adding a POST route", ()=>{
    expect(Router.POST).to.be.a('function');
  })
  it("should have a method for adding a PUT route", ()=>{
    expect(Router.PUT).to.be.a('function');
  })
  it("should have a method for adding a DELETE route", ()=>{
    expect(Router.DELETE).to.be.a('function');
  })

  describe("adding a GET route", ()=>{
    beforeEach(()=>{
      Router = Router.GET('/hello', ()=>'hello');
    })
    afterEach(()=>{
      Router = new RouteManager();
    })
    it("should allow that route to then be found", (done)=>{
      Router.find('GET', '/hello')
        .then((result)=>{
          expect(result).to.equal('hello');
        })
        .then(done)
    })
    it("should not allow that route to be found on other methods", (done)=>{
      Router.find('POST', '/hello')
        .catch((err)=>{
          expect(err.code).to.equal(404);
        })
        .then(done);
    })

    describe("with a trailing forward slash", ()=>{
      beforeEach(()=>{
        Router = Router.GET('/unique/', ()=>'hello');
      })

      it("should allow that route to then be found", (done)=>{
        Router.find('GET', '/unique')
          .then((result)=>{
            expect(result).to.equal('hello');
          })
          .catch((err)=>done(err))
          .then(done);
      })
    })
    describe("without a beginning forward slash", ()=>{
      beforeEach(()=>{
        Router = Router.GET('unique', ()=>'hello');
      })

      it("should allow that route to then be found", (done)=>{
        Router.find('GET', '/unique')
          .then((result)=>{
            expect(result).to.equal('hello');
          })
          .catch((err)=>done(err))
          .then(done);
      })
    })
  })

  describe("adding a route with middleware", ()=>{
    let sum = (params, ...args) => {
      return args.reduce((prv, cr)=>prv+cr, 0);
    }
    let answer = (arg) => 'answer is '+arg;
    beforeEach(()=>{
      Router = Router.GET('/answer', sum, answer);
    })
    afterEach(()=>{
      Router = new RouteManager();
    })

    it("should respond with the result passed through", (done)=>{
      Router.find('GET', '/answer', 1, 2, 3)
        .then((result)=>{
          expect(result).to.equal('answer is 6');
        })
        .then(done)
        .catch(done)
    })
  })

  describe("a route which returns an array", ()=>{
    let result
    beforeEach(()=>{
      result = [1,2,3];
      Router = Router.GET('/hello', ()=>result);
    })
    afterEach(()=>{
      Router = new RouteManager();
    })
    it("should not require special treatment", (done)=>{
      Router.find('GET', '/hello')
        .then((result)=>{
          expect(result).to.deep.equal(result);
        })
        .then(done)
        .catch(done)
    });
    describe("with one element", ()=>{
      beforeEach(()=>{
        result = [1];
        Router = Router.GET('/hello', ()=>result);
      })
      afterEach(()=>{
        Router = new RouteManager();
      })
      it("should not require special treatment", (done)=>{
        Router.find('GET', '/hello')
          .then((result)=>{
            expect(result).to.deep.equal(result);
          })
          .then(done)
          .catch(done)
      });
    })
  })

  describe("middleware that returns an array", ()=>{
    let result
    beforeEach(()=>{
      result = [1,2,3];
      Router = Router.GET('/hello', ()=>result, (a,b,c)=>[a,b,c]);
    })
    afterEach(()=>{
      Router = new RouteManager();
    })
    it("should spread the result as arguments to the next function", (done)=>{
        Router.find('GET', '/hello')
          .then((result)=>{
            expect(result).to.deep.equal(result);
          })
          .then(done)
          .catch(done)
    })
  })

  describe("reading parameters", ()=>{
    beforeEach(()=>{
      Router = Router.GET('/hello/:name', (params)=>params.name);
    })
    it("should return an object of the parameters as the first argument", (done)=>{
        Router.find('GET', '/hello/hal')
          .then((result)=>{
            expect(result).to.equal('hal');
          })
          .then(done)
          .catch(done)
    })
  })
})
