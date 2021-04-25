const EventEmitter = require('events');

class ProxyExtender {
  constructor(traps) {
    return new Proxy(this, traps);
  }
}

class IndirectEmitter extends ProxyExtender {
  #listeners = [];
  #queuedEvents = [];
  #maxListeners = EventEmitter.defaultMaxListeners;
  #originalMaxListeners;
  #emitter;

  constructor(emitter) {
    super({
      get: (obj, prop) => {
        if (obj.hasOwnProperty(prop) || typeof obj[prop] == 'function') {
          return obj[prop];
        } else {
          if (this.#emitter) {
            return this.#emitter[prop];
          } else {
            return undefined;
          }
        }
      },
      set: (obj, prop, value) => {
        if (obj.hasOwnProperty(prop)) {
          obj[prop] = value;
        } else {
          if (this.#emitter) {
            this.#emitter[prop] = value;
          }
        }
        return true;
      }
    });

    this.setEmitter(emitter);
  }

  _addListener(eventName, listener, once, prepend = false) {
    let wrappedListener = (...args) => {
      listener(...args);

      if (once) {
        this._removeListener(eventName, wrappedListener);
      }
    };

    if (prepend) {
      this.#listeners.unshift({eventName, listener, wrappedListener, once, active: true});
    } else {
      this.#listeners.push({eventName, listener, wrappedListener, once, active: true});
    }

    if (this.#emitter) {
      this._registerListener(eventName, wrappedListener, once, prepend);
    }
  }

  _registerListener(eventName, listener, once, prepend = false) {
    if (!this.#emitter) return;

    if (once) {
      if (prepend) {
        this.#emitter.prependOnceListener(eventName, listener);
      } else {
        this.#emitter.once(eventName, listener);
      }
    } else {
      if (prepend) {
        this.#emitter.prependListener(eventName, listener);
      } else {
        this.#emitter.on(eventName, listener);
      }
    }
  }

  _registerListeners() {
    for (const {eventName, wrappedListener, once} of this.#listeners) {
      this._registerListener(eventName, wrappedListener, once);
    }
  }

  _removeListener(eventName, listener) {
    this.#listeners = this.#listeners.filter((info) => {
      return !(info.eventName == eventName &&
               info.listener == listener);
    });
  }

  _unregisterListeners() {
    if (!this.#emitter) return;

    for (const {eventName, wrappedListener} of this.#listeners) {
      this.#emitter.removeListener(eventName, wrappedListener);
    }
  }

  addListener(eventName, listener) {
    return this.on(eventName, listener);
  }

  emit(eventName, ...args) {
    if (this.#emitter) {
      return this.#emitter.emit(eventName, ...args);
    } else {
      this.#queuedEvents.push({eventName, args});

      let listenerAvailable = false;
      for (const info of this.#listeners) {
        if (info.eventName == eventName && info.active) {
          listenerAvailable = true;
          info.active = false;
        }
      }

      return listenerAvailable;
    }
  }

  eventNames() {
    const names = new Set();
    for (const info of this.#listeners) {
      if (info.active) {
        names.add(info.eventName);
      }
    }

    return Array.from(names);
  }

  getMaxListeners() {
    return this.#maxListeners;
  }

  hasEmitter() {
    return this.#emitter !== undefined;
  }

  listenerCount(eventName) {
    let count = 0;
    for (const info of this.#listeners) {
      if (info.eventName == eventName && info.active) {
        count += 1;
      }
    }
    return count;
  }

  listeners(eventName) {
    const listeners = [];
    for (const info of this.#listeners) {
      if (info.eventName == eventName && info.active) {
        listeners.push(info.listener);
      }
    }
    return listeners;
  }

  on(eventName, listener) {
    this._addListener(eventName, listener, false);

    return this;
  }

  once(eventName, listener) {
    this._addListener(eventName, listener, true);

    return this;
  }

  off(eventName, listener) {
    this.removeListener(eventName, listener);

    return this;
  }

  prependListener(eventName, listener) {
    this._addListener(eventName, listener, false, true);

    return this;
  }

  prependOnceListener(eventName, listener) {
    this._addListener(eventName, listener, true, true);

    return this;
  }

  removeAllListeners(eventName) {
    const remove = [];
    for (const info of this.#listeners) {
      if (info.eventName == eventName) {
        remove.push(info.listener);
      }
    }

    for (const listener of remove) {
      this.removeListener(eventName, listener);
    }

    return this;
  }

  removeListener(eventName, listener) {
    if (this.#emitter) {
      for (const info of this.#listeners) {
        if (info.listener == listener &&
            info.eventName == eventName) {
          this.#emitter.removeListener(eventName, info.wrappedListener);
        }
      }
    }

    this._removeListener(eventName, listener);

    return this;
  }

  setEmitter(emitter) {
    if (this.#emitter) {
      this.#emitter.setMaxListeners(this.#originalMaxListeners);
    }

    this._unregisterListeners();
    this.#emitter = emitter;

    if (!emitter) return;

    this.#originalMaxListeners = emitter.getMaxListeners();
    emitter.setMaxListeners(this.#maxListeners);
    this._registerListeners();

    for (const {eventName, args} of this.#queuedEvents) {
      this.emit(eventName, ...args);
    }

    this.#queuedEvents = [];
  }

  setMaxListeners(n) {
    this.#maxListeners = n;

    if (this.#emitter) {
      this.#emitter.setMaxListeners(n);
    }

    return this;
  }
}

module.exports = IndirectEmitter;