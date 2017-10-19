'use strict';
const FlushBuffer = require('../');
const expect = require('chai').expect;

describe('Flush Buffer', () => {

	it('should flush when timeout exceeds', (done) => {
		const buffer = new FlushBuffer({flushInterval: 10});

		buffer.on('flush', (data) => {
			expect(data).to.have.a.lengthOf(1);
			expect(data[0]).to.equal('bla');
			setTimeout(() => {
				expect(buffer.buffer).to.have.lengthOf(0);
				done();
			}, 0);
		});

		buffer.add('bla');
	});

	it('should flush on maxItems', (done) => {
		const buffer = new FlushBuffer({maxItems: 1});

		buffer.on('flush', (data) => {
			expect(data).to.have.a.lengthOf(1);
			expect(data[0]).to.equal('bla');
			setTimeout(() => {
				expect(buffer.buffer).to.have.lengthOf(0);
				done();
			}, 0);
		});

		buffer.add('bla');
	});

	it('should not emit flush if no data exists', (done) => {
		const buffer = new FlushBuffer({flushInterval: 1});

		let flushed = false;

		buffer.on('flush', () => {
			flushed = true;
		});

		setTimeout(() => {
			expect(flushed).to.be.false;
			done();
		}, 2);
	});

	it('should emit error if flush listener throws', (done) => {
		const buffer = new FlushBuffer({flushInterval: 1});
		buffer.on('flush', () => {
			throw new Error('shit');
		});

		buffer.on('error', (err) => {
			expect(err.message).to.equal('shit');
			done();
		});

		buffer.add('a');
	});

});
