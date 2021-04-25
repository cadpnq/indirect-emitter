# indirect-emitter

An emitter indirection library.

![coverage](https://img.shields.io/endpoint?style=plastic&url=https%3A%2F%2Fgist.githubusercontent.com%2Fcadpnq%2F02ed0130481b0141ef7a1943526b3a5b%2Fraw%2Findirect-emitter__heads_main.json) ![GitHub package.json version](https://img.shields.io/github/package-json/v/cadpnq/indirect-emitter?style=plastic) ![GitHub](https://img.shields.io/github/license/cadpnq/indirect-emitter?style=plastic)

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