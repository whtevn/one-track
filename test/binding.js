import Binder from '../lib/function-bindery';
const chai = require('chai');
const expect = chai.expect;
const should = chai.should;

function hello(place){
  return ((this&&this.say)||'hello ')+place
};

describe('running a function', () => {
  describe("by passing a function", () => {
    it("should successfully run the function", (done) => {
      Binder.run(hello, 'world')
        .then((result) => {
          expect(result).to.equal('hello world');
        })
        .then(done)
        .catch(done)
    })
  })
  
  describe("by passing an array", () => {
    it("should successfully run the function", (done) => {
      Binder.run([this, hello], 'world')
        .then((result) => {
          expect(result).to.equal('hello world');
        })
        .then(done)
        .catch(done)
    })

    describe("with a specific context", () => {
      let ctx;
      beforeEach(()=>{
        ctx = {say: 'goodbye '}
      })
      it("should successfully run the function with that context", (done) => {
        Binder.run([ctx, hello], 'world')
          .then((result) => {
            expect(result).to.equal('goodbye world');
          })
          .then(done)
          .catch(done)
      })
    })
  })
});

describe("packing a function", ()=>{
  let arg_mangler;
  beforeEach(()=>{
    arg_mangler = ()=>{};
  })
  describe("defining the argument munger", () => {
    it("should result in an object that has .to as a function", ()=>{
      expect(typeof Binder.send(arg_mangler).to).to.equal('function');
    })
    describe("sending a function to its .to", () => {
      let mangler = Binder.send(arg_mangler)
      it("should result in a function", ()=>{
        expect(typeof mangler.to(()=>{})).to.equal('function');
      });
    })
  })
})

describe("using a packed function", ()=>{
  let arg_mangler;
  let packed_func;
  let speak_to_world = (phrase) => phrase+", world";
  beforeEach(()=>{
    arg_mangler = (params) => [params.say]
    packed_func = Binder.send(arg_mangler).to(speak_to_world);
  })

  it("should send the right arguments", (done)=>{
    packed_func({say: 'hello'})
      .then((result) => expect(result).to.equal("hello, world"))
      .then(()=>done())
      .catch(done)
  })

  describe("sending to many arguments", (done)=>{
    let ringer_func = Binder.send(()=>[1,2,3]).to((a,b,c)=>{
      return a+b+c
    });;
    it("should use the args resulting from the pack", (done) => {
      ringer_func(5, 6, 7)
        .then((result) => expect(result).to.equal(6))
        .then(()=>done())
        .catch(done)
    })
  })
})
