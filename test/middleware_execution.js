const chai = require('chai');
const expect   = chai.expect;
import { 
   find_and_run
 }   from '../lib/function-bindery';
import { 
   add_route
 }   from '../lib/pathify';

import { Send } from '../lib/function-bindery';

function hello(obj){
  return ((this&&this.say)||'hello ')+(obj.place||obj)
};

describe('running middleware', () => {
  let routes;
  beforeEach(()=>{
    routes = add_route(undefined, 'GET', '/hello/:place', hello); 
  })

  it("should run the first function with all sent args", (done) => {
    routes = add_route(undefined, 'GET', '/hello/:place', hello); 
    find_and_run(routes, 'GET', "/hello/world")
        .then((result) => {
          expect(result).to.equal('hello world');
        })
        .then(done)
        .catch(done)
  })

  it("should run the first function if presented an array", (done) => {
    routes = add_route(undefined, 'GET', '/hello/:place', [this, hello]); 
    find_and_run(routes, 'GET', "/hello/world")
        .then((result) => {
          expect(result).to.equal('hello world');
        })
        .then(done)
        .catch(done)
  })

  it("should run the first function if presented a specific context", (done) => {
    routes = add_route(undefined, 'GET', '/hello/:place', [{say:'goodbye '}, hello]); 
    find_and_run(routes, 'GET', "/hello/world")
        .then((result) => {
          expect(result).to.equal('goodbye world');
        })
        .then(done)
        .catch(done)
  })

  it("should chain methods together", (done) => {
    routes = add_route(undefined, 'GET', '/hello/:place', hello, hello); 
    find_and_run(routes, 'GET', "/hello/world")
        .then((result) => {
          expect(result).to.equal('hello hello world');
        })
        .then(done)
        .catch(done)
  })


  describe("using binder-generated methods", () => {
    let ringer = ()=>[1, 2, 3];
    let sum = (a, b, c) => a+b+c;
    let sum_ringer = Send(ringer).to((a, b, c) => a+b+c);
    let ray = (...args) => args;
    let ray_ringer = (...args) => [1];
    it("should work", (done) => {
      routes = add_route(undefined, 'GET', '/hello/:place', sum_ringer); 
      find_and_run(routes, 'GET', "/hello/world", 5, 6, 7)
        .then((result) =>{
           expect(result).to.equal(6)
        })
        .then(done)
        .catch(done)

    })

    it("should pass arrays as arguments into middleware", (done)=>{
      routes = add_route(undefined, 'GET', '/hello/:place', ringer, sum); 
      find_and_run(routes, 'GET', "/hello/world", 5, 6, 7)
        .then((result) =>{
           expect(result).to.equal(6)
        })
        .then(done)
        .catch(done)
    })

    it("should be able to return an array", (done)=>{
      routes = add_route(undefined, 'GET', '/hello', Send((params, ...args)=>args).to(ray)); 
      find_and_run(routes, 'GET', "/hello", 5, 6, 7)
        .then((result) =>{
           expect(result).to.deep.equal([5,6,7])
        })
        .then(done)
        .catch(done)
    })

    it("should be able to return an array with a single element", (done)=>{
      routes = add_route(undefined, 'GET', '/hello/:place', ray_ringer); 
      find_and_run(routes, 'GET', "/hello/world", 5, 6, 7)
        .then((result) =>{
           expect(result).to.deep.equal([1])
        })
        .then(done)
        .catch(done)
    })
  })
})
