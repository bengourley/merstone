module.exports = Model

var EventEmitter = require('events').EventEmitter
  , assign = require('lodash.assign')
  , createPipe = require('piton-pipe').createPipe
  , clone = require('lodash.clonedeep')
  , uid = require('hat')

function Model(serviceLocator, attributes) {
  EventEmitter.apply(this)
  this.serviceLocator = serviceLocator
  this.attributes = attributes || {}
  this._hooks = { preSet: createPipe() }
  this.cid = uid()
  this.id = this.attributes._id || this.attributes.id || null
}

// Inherit from event emitter
Model.prototype = Object.create(EventEmitter.prototype)

/*
 * Get a single attribute.
 */
Model.prototype.get = function (name) {
  return this.attributes[name]
}

/*
 * Set one or many attributes.
 *
 *   model.set('key', value)
 *   model.set({ key1: value1, key2: value2 })
 *
 * Events:
 *   change
 *   change:attributeName
 *
 * Hooks:
 *   preSet
 *
 */
Model.prototype.set = function () {

  var attributes

  if (arguments.length === 2) {
    // model.set('k', v)
    attributes = {}
    attributes[arguments[0]] = arguments[1]
  } else {
    attributes = arguments[0]
  }

  this._hooks.preSet.run(attributes, function (err, attributes) {

    var changes = Object.keys(attributes)

    assign(this.attributes, attributes)
    this.emit('change', this)
    changes.forEach(function (k) {
      this.emit('change:' + k, this.get(k), this)
    }.bind(this))

  }.bind(this))

  return this

}

/*
 * Add a hook function
 */
Model.prototype.hook = function (name, fn) {
  return this._hooks[name].add(fn)
}

/*
 * Serialise the current state of the object's attributes.
 * This creates a deep clone, so if the result of toJSON() is modified
 * it does not affect the object that was toJSON()'d. This calls .toJSON()
 * on any attributes that have the method so that only model attributes
 * are serialized, as opposed to whole model instances.
 */
Model.prototype.toJSON = function () {

  // Create a fresh object to house the
  // cloned attribute properties
  var attributes = {}

  // Go through each attribute
  Object.keys(this.attributes).forEach(function (key) {

    var value = this.attributes[key]

    // Check if we have some nested object with a toJSON method
    if ((value) && (typeof value.toJSON === 'function')) {
      // Execute toJSON to get the attribute's value
      attributes[key] = value.toJSON()
    } else {
      // Otherwise clone the attribute
      attributes[key] = clone(value)
    }

  }.bind(this))

  return attributes

}

/*
 * Reset the model's attributes
 */
Model.prototype.reset = function (attrs) {
  if (!attrs) attrs = {}
  this.attributes = attrs
  this.id = this.attributes._id || this.attributes.id || null
  this.emit('reset', this)
}
