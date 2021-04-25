const EventEmitter = require('events');
const IndirectEmitter = require('../index.js');

class ExtendedEmitter extends EventEmitter {
  testProperty = 42;

  testMethod() {
    return 'test';
  }
}

function setup(context) {
  context.indirect = new IndirectEmitter();
  context.emitterA = new EventEmitter();
  context.emitterB = new EventEmitter();
  context.extended = new ExtendedEmitter();
}

describe('IndirectEmitter', function() {
  beforeEach(function() {
    setup(this);
  });

  describe('proxied getter/setters', function() {
    it('should return undefined when accessing an unknown property when no emitter is attached', function() {
      assert.isUndefined(this.indirect.testProperty, 'property was not undefined');
    });

    it('should return the property value from the underlying emitter when one is attached', function() {
      this.indirect.setEmitter(this.extended);
      assert.isUndefined(this.indirect.unknownProperty, 'property was not undefined');
      assert.equal(this.indirect.testProperty, 42, 'property was not the correct value');
    });

    it('should do nothing on assignment when no emitter is attached', function() {
      this.indirect.testProperty = 10;
    });

    it('should set the value on the underlying emitter when one is attached', function() {
      this.indirect.setEmitter(this.extended);
      this.indirect.testProperty = 100;
      assert.equal(this.indirect.testProperty, 100, 'property was not the same value');
    });
  });

  describe('#addListener()', function() {
    it('should alias add()', function() {
      const listener = () => 0;
      this.indirect.addListener('test', listener);
      assert.deepEqual(this.indirect.listeners('test'), [listener], 'listener was not added');
    });

    it('should return the IndirectEmitter', function() {
      assert.equal(this.indirect.addListener('test', () => 0), this.indirect, 'function did not return reference to instance')
    });
  });

  describe('#emit()', function() {
  });

  describe('#eventNames()', function() {
    it('should return an array of event names with registered listeners', function() {
      this.indirect.on('test1', () => 0);
      assert.deepEqual(this.indirect.eventNames(), ['test1'], 'returned event names were not correct');
      this.indirect.once('test2', () => 0);
      assert.deepEqual(this.indirect.eventNames(), ['test1', 'test2'], 'returned event names were not correct');
    });
  });

  describe('#getMaxListeners()', function() {
    beforeEach(function() {
      setup(this);
    });
    
    it('should initially return the default value', function() {
      assert.equal(this.indirect.getMaxListeners(), EventEmitter.defaultMaxListeners);
    });

    it('should return the current max listeners', function() {
      this.indirect.setMaxListeners(100);
      assert.equal(this.indirect.getMaxListeners(), 100);
    });

    it('should set the max value on the underlying emitter', function() {
      this.indirect.setEmitter(this.emitterA);
      this.indirect.setMaxListeners(100);
      assert.equal(this.emitterA.getMaxListeners(), 100);
    });
  });

  describe('#hasEmitter()', function() {
    it('should return false when no emitter is attached', function() {
      assert.isFalse(this.indirect.hasEmitter(), 'did not return false');
    });

    it('should return true when an emitter is attached', function() {
      this.indirect.setEmitter(this.emitterA);
      assert.isTrue(this.indirect.hasEmitter(), 'did not return true');
    });
  });

  describe('#listenerCount()', function() {
    it('should return the number of listeners registered for an event', function() {
      assert.equal(this.indirect.listenerCount('test'), 0, 'number of listeners was incorrect');
      this.indirect.on('test', () => 0);
      assert.equal(this.indirect.listenerCount('test'), 1, 'number of listeners was incorrect');
      this.indirect.once('test', () => 0);
      assert.equal(this.indirect.listenerCount('test'), 2, 'number of listeners was incorrect');
    });
  });

  describe('#listeners()', function() {
    it('should return a list of registered listeners for an event', function() {
      const listenerA = () => 0;
      const listenerB = function() { return 0; }

      assert.deepEqual(this.indirect.listeners('test'), [], 'list of listeners did not match');

      this.indirect.on('test', listenerA);
      assert.deepEqual(this.indirect.listeners('test'), [listenerA], 'list of listeners did not match');

      this.indirect.on('test', listenerB);
      assert.deepEqual(this.indirect.listeners('test'), [listenerA, listenerB], 'list of listeners did not match');

      this.indirect.once('test', listenerA);
      assert.deepEqual(this.indirect.listeners('test'), [listenerA, listenerB, listenerA], 'list of listeners did not match');
    });
  });

  describe('#on()', function() {
    it('should register a listener', function() {
      const listener = () => 0;
      this.indirect.on('test', listener);
      assert.deepEqual(this.indirect.listeners('test'), [listener], 'listener was not added');
    });

    it('should return the IndirectEmitter', function() {
      assert.equal(this.indirect.on('test', () => 0), this.indirect, 'function did not return reference to instance')
    });
  });

  describe('#once()', function() {
    it('should register a listener', function() {
      const listener = () => 0;
      this.indirect.on('test', listener);
      assert.deepEqual(this.indirect.listeners('test'), [listener], 'listener was not added');
    });

    it('should return the IndirectEmitter', function() {
      assert.equal(this.indirect.once('test', () => 0), this.indirect, 'function did not return reference to instance')
    });
  });

  describe('#off()', function() {
    it('should alias removeListener()', function() {
      const listener = () => 0;
      this.indirect.on('test', listener);
      assert.deepEqual(this.indirect.listeners('test'), [listener], 'listener was not added');
      this.indirect.off('test', listener);
      assert.deepEqual(this.indirect.listeners('test'), [], 'listener was not removed');
    });

    it('should return the IndirectEmitter', function() {
      assert.equal(this.indirect.off('test', () => 0), this.indirect, 'function did not return reference to instance')
    });
  });

  describe('#prependListener()', function() {
    it('should prepend a listener', function() {
      const listenerA = () => 0;
      const listenerB = () => 0;

      assert.deepEqual(this.indirect.listeners('test'), [], 'list of listeners did not match');

      this.indirect.on('test', listenerA);
      assert.deepEqual(this.indirect.listeners('test'), [listenerA], 'list of listeners did not match');

      this.indirect.prependListener('test', listenerB);
      assert.deepEqual(this.indirect.listeners('test'), [listenerB, listenerA], 'list of listeners did not match');
    });

    it('should return the IndirectEmitter', function() {
      assert.equal(this.indirect.prependListener('test', () => 0), this.indirect, 'function did not return reference to instance')
    });
  });

  describe('#prependOnceListener()', function() {
    it('should prepend a listener', function() {
      const listenerA = () => 0;
      const listenerB = () => 0;

      assert.deepEqual(this.indirect.listeners('test'), [], 'list of listeners did not match');

      this.indirect.once('test', listenerA);
      assert.deepEqual(this.indirect.listeners('test'), [listenerA], 'list of listeners did not match');

      this.indirect.prependOnceListener('test', listenerB);
      assert.deepEqual(this.indirect.listeners('test'), [listenerB, listenerA], 'list of listeners did not match');
    });

    it('should return the IndirectEmitter', function() {
      assert.equal(this.indirect.prependOnceListener('test', () => 0), this.indirect, 'function did not return reference to instance')
    });
  });

  describe('#removeAllListeners()', function() {
    it('should remove all listeners for an event', function() {
      const listenerA = () => 0;
      const listenerB = () => 0;

      this.indirect.on('test', listenerA);
      this.indirect.once('test', listenerB);
      assert.deepEqual(this.indirect.listeners('test'), [listenerA, listenerB], 'listeners were not added');

      this.indirect.removeAllListeners('test');
      assert.deepEqual(this.indirect.listeners('test'), [], 'listeners were not removed');
    });

    it('should return the IndirectEmitter', function() {
      assert.equal(this.indirect.removeAllListeners('test'), this.indirect, 'function did not return reference to instance')
    });
  });

  describe('#removeListener()', function() {
    it('should remove a listener', function() {
      const listener = () => 0;
      this.indirect.on('test', listener);
      assert.deepEqual(this.indirect.listeners('test'), [listener], 'listener was not added');
      this.indirect.removeListener('test', listener);
      assert.deepEqual(this.indirect.listeners('test'), [], 'listener was not removed');
    });

    it('should return the IndirectEmitter', function() {
      assert.equal(this.indirect.removeListener('test', () => 0), this.indirect, 'function did not return reference to instance')
    });
  });

  describe('#setEmitter()', function() {
  });

});