# indirect-emitter

An event emitter indirection library.

![Codacy grade](https://img.shields.io/codacy/grade/dddf9e1ff764454abb9dff212bd4218e?style=plastic) ![Codacy coverage](https://img.shields.io/codacy/coverage/dddf9e1ff764454abb9dff212bd4218e?style=plastic) ![GitHub package.json version](https://img.shields.io/github/package-json/v/cadpnq/indirect-emitter?style=plastic) ![GitHub](https://img.shields.io/github/license/cadpnq/indirect-emitter?style=plastic)

## Description
indirect-emitter is a library for decoupling event emitters from the code that registers listeners. This layer of indirection allows swapping out the underlying emitter without needing to (un)register all of your listeners manually. It implements the `EventEmitter` API and any nonstandard properties/methods are proxied to the `IndirectEmitter` instance from the underlying emitter.

## Example
```js
const EventEmitter = require('events');
const IndirectEmitter = require('indirect-emitter');

const emitterA = new EventEmitter();
const emitterB = new EventEmitter();
const indirect = new IndirectEmitter(emitterA);

indirect.on('derp', () => {
  console.log('Hello World!');
});

emitterA.emit('derp'); // => 'Hello World!" printed
indirect.setEmitter(emitterB);
emitterB.emit('derp'); // => 'Hello World!" printed
```
