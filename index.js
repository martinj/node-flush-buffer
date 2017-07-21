'use strict';

const EventEmitter = require('events');

class FlushBuffer extends EventEmitter {

	constructor({flushInterval, maxItems}) {
		super();
		this.flushInterval = flushInterval || 10000;
		this.maxItems = maxItems || 100;
		this.buffer = [];
		this.flushTimeoutId = setTimeout(() => this.flush(), this.flushInterval).unref();
	}

	add(data) {
		if (data) {
			this.buffer.push(data);
			if (this.buffer.length >= this.maxItems) {
				this.flush();
			}
		}
	}

	flush() {
		clearTimeout(this.flushTimeoutId);
		this.flushTimeoutId = setTimeout(() => this.flush(), this.flushInterval);

		if (!this.buffer.length) {
			return;
		}

		this.emit('flush', this.buffer);
		this.buffer = [];
	}
}

module.exports = FlushBuffer;
