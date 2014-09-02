var Model = require('../')
  , assert = require('assert')
  , unique = require('lodash.uniq')

describe('model', function () {

  describe('new Model()', function () {

    it('should create a new model', function () {
      var m = new Model()
      assert.equal(m.__proto__, Model.prototype) // jshint ignore:line
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

})
