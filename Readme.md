# Merstone

[![Build Status](https://travis-ci.org/bengourley/merstone.svg)](https://travis-ci.org/bengourley/merstone)

A data-model abstraction. This is a base class for models. You can construct one
if all you want to do is observe some data, or you can extend it if you want that
and more.

If you have used Backbone before, Merstone models will be familiar to you. The main
difference is that where Backbone models are "active record"-like, i.e. they correspond
to an API and deal with persistence, Merstone models are not. They don't have any
functionality pertaining to persistence at all. They are intended to be used in a
service oriented architecture, i.e you call `model.toJSON()` and pass that to a service
for persistence. This allows greater flexibility, but still allows you to extend the
models and build in behaviour like `save()` and `fetch()` should you wish.

## Installation

```
npm install --save merstone
```

## Usage

```js
//
// Constructor
//

var Model = require('merstone')
  , m = new Model(serviceLocator, {})

//
// Getting, setting and resetting
//

m.get('name')

m.set('name', 'Ben')
m.set({ firstName: 'Ben', lastName: 'Gourley'})

m.reset({ firstName: 'Cara', lastName: 'Haines'})

//
// Events
//

m.on('change', function (model) {
  console.log('An attribute changed on model ' + model.id)
})

m.on('change:name', function (value, model) {
  console.log('Name attribute is now ' + value + ' on model ' + model.id)
})

m.on('reset', function (model) {
  console.log('model ' + model.id + ' attributes were reset')
})

//
// Serialisation
//

// Creates a deep clone of the model's attributes
m.toJSON()

//
// Hooks
//

// 'preSet'
// These hooks are run on .set() before the model attributes are updated
// Accepting raw user input? Maybe you want to do some type casting…

m.hook('preSet', castNumbers)

function castNumbers(attributes, cb) {
  // Do something to the attributes
  if (attributes.age) attributes.age = parseInt(attributes.age, 10)
  cb(null, attributes)
}
```

## The name?
I've made a bunch of MVC-like components. I named each one after villages on the
[Isle of Wight](http://en.wikipedia.org/wiki/Isle_of_Wight) (where I live) beginning
with the same letter as the thing it represents.

See also [Ventnor views](https://github.com/bengourley/ventnor) and
[Chale collections](https://github.com/bengourley/ventnor).

## Credits
* [Ben Gourley](https://github.com/bengourley/)

## Licence
Copyright (c) 2014, Ben Gourley

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
