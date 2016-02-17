const chai = require('chai');
const expect   = chai.expect;
import { 
   execute_middleware
 }   from '../lib/pathify';

import { Send } from '../lib/function-bindery';

function hello(place){
  return ((this&&this.say)||'hello ')+place
};

describe('running middleware', () => {
  it("should run the first function with all sent args", (done) => {
    execute_middleware([hello], false, 'world')
        .then((result) => {
          expect(result).to.equal('hello world');
        })
        .then(done)
        .catch(done)
  })

  it("should chain methods together", (done) => {
    execute_middleware([hello, hello], false, 'world')
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
      execute_middleware([sum_ringer], false, 5, 6, 7)
        .then((result) =>{
           expect(result).to.equal(6)
        })
        .then(done)
        .catch(done)

    })

    it("should pass arrays as arguments into middleware", (done)=>{
      execute_middleware([ringer, sum], false, 5, 6, 7)
        .then((result) =>{
           expect(result).to.equal(6)
        })
        .then(done)
        .catch(done)
    })

    it("should be able to return an array", (done)=>{
      execute_middleware([ringer, sum], false, 5, 6, 7)
        .then((result) =>{
           expect(result).to.equal(6)
        })
        .then(done)
        .catch(done)
    })

    it("should be able to return an array", (done)=>{
      execute_middleware([ray], false, 5, 6, 7)
        .then((result) =>{
           expect(result).to.deep.equal([5,6,7])
        })
        .then(done)
        .catch(done)
    })

    it("should be able to return an array with a single element", (done)=>{
      execute_middleware([ray_ringer], false, 5, 6, 7)
        .then((result) =>{
           expect(result).to.deep.equal([1])
        })
        .then(done)
        .catch(done)
    })
  })
})
