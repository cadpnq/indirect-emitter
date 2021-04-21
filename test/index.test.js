const EventEmitter = require('events');
const IndirectEmitter = require('../index.js');


function setup(context) {
  context.indirect = new IndirectEmitter();
  context.emitterA = new EventEmitter();
  context.emitterB = new EventEmitter();
}

describe('IndirectEmitter', function() {
  beforeEach(function() {
    setup(this);
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
    it('should return the IndirectEmitter', function() {
      assert.equal(this.indirect.on('test', () => 0), this.indirect, 'function did not return reference to instance')
    });
  });

  describe('#once()', function() {
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
    it('should return the IndirectEmitter', function() {
      assert.equal(this.indirect.prependListener('test', () => 0), this.indirect, 'function did not return reference to instance')
    });
  });

  describe('#prependOnceListener()', function() {
    it('should return the IndirectEmitter', function() {
      assert.equal(this.indirect.prependOnceListener('test', () => 0), this.indirect, 'function did not return reference to instance')
    });
  });

  describe('#removeAllListeners()', function() {
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