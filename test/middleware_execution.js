const chai = require('chai');
const expect   = chai.expect;
import { 
   execute_middleware
 }   from '../lib';

import Binder from '../lib/function-bindery';
const Send   = Binder.send;

function hello(place){
  return ((this&&this.say)||'hello ')+place
};

describe('running middleware', () => {
  it("should run the first function with all sent args", (done) => {
    execute_middleware([hello], 'world')
        .then((result) => {
          expect(result).to.equal('hello world');
        })
        .then(done)
        .catch(done)
  })

  it("should chain methods together", (done) => {
    execute_middleware([hello, hello], 'world')
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
    it("should work", (done) => {
      execute_middleware([sum_ringer], 5, 6, 7)
        .then((result) =>{
           expect(result).to.equal(6)
        })
        .then(done)
        .catch(done)

    })

    it("should pass arrays as arguments into middleware", (done)=>{
      execute_middleware([ringer, sum], 5, 6, 7)
        .then((result) =>{
           expect(result).to.equal(6)
        })
        .then(done)
        .catch(done)
    })
  })
})
