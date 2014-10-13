var Model = require('../')
  , assert = require('assert')
  , unique = require('lodash.uniq')

describe('model', function () {

  describe('new Model()', function () {

    it('should create a new model', function () {
      var m = new Model()
      assert(m instanceof Model)
    })

    it('should set initial attributes', function () {
      var m = new Model({}, { a: 10 })
      assert.equal(m.attributes.a, 10)
    })

    it('should generate a unique cid', function () {
      var cids =
        [ new Model(), new Model(), new Model() ]
        .map(function (model) { return model.cid })
      assert.equal(cids.length, unique(cids).length)
    })

    it('should set use initial attribute _id as the model id', function () {
      var m = new Model({}, { _id: '123' })
      assert.equal(m.id, '123')
    })

  })

  describe('get()', function () {
    it('should retrieve an attribute', function () {
      var m = new Model({}, { a: 10 })
      assert.equal(m.get('a'), 10)
    })
  })

  describe('set()', function () {

    it('should support the set(key, value) syntax', function () {
      var m = new Model({}, { a: 10 })
      m.set('a', 20)
      assert.equal(m.get('a'), 20)
    })

    it('should support the set(attributes) syntax', function () {
      var m = new Model({}, { a: 10 })
      m.set({ a: 20, b: 'foo' })
      assert.equal(m.get('a'), 20)
      assert.equal(m.get('b'), 'foo')
    })

    it('should emit a change event', function (done) {
      var m = new Model({}, { a: 10 })
      m.on('change', function () {
        done()
      })
      m.set('a', 20)
    })

    it('should emit a change event for each changed attribute', function (done) {
      var m = new Model({}, { a: 10 })
      m.on('change:a', function (value, mod) {
        assert.equal(value, 20)
        assert.equal(m, mod)
        done()
      })
      m.set({ a: 20 })
    })

  })

  describe('reset()', function () {

    it('should emit a reset event', function (done) {
      var m = new Model({}, { a: 10 })
      m.on('reset', function () {
        done()
      })
      m.reset({ a: 20 })
    })

    it('should clear attributes by default', function (done) {
      var m = new Model({}, { a: 10 })
      m.on('reset', function () {
        assert.equal(Object.keys(m.attributes).length, 0)
        done()
      })
      m.reset()
    })

  })

  describe('toJSON()', function () {

    it('should create deep clones of properties', function () {
      var m = new Model({}, { arr: [], obj: {} })
        , json = m.toJSON()
      m.attributes.arr.push(10)
      m.attributes.obj.id = '123'
      assert.equal(json.arr.length, 0)
      assert.equal(Object.keys(json.obj).length, 0)
    })

    it('should call the toJSON() method if it exists on a property', function (done) {
      var m = new Model({}, { attr: { toJSON: function () { done() } } })
      m.toJSON()
    })

  })

  describe('hook()', function () {

    it('should run preSet hooks on set()', function (done) {

      var m = new Model({}, {})
      m.hook('preSet', function (attributes, cb) {
        attributes.age = parseInt(attributes.age, 10)
        cb(null, attributes)
      })
      m.on('change', function () {
        assert.equal(m.get('age'), 25)
        done()
      })
      m.set('age', '25')
    })

  })

})
