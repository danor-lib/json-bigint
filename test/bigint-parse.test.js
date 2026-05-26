import assert from 'node:assert/strict';
import test from 'node:test';

import { parse, stringify } from '../index.js';



test('native BigInt parse support', async (t) => {
	if(!BigInt) { throw new Error('No native BigInt. Test is break...'); }


	const input = '{"big":92233720368547758070,"small":123,"deci":1234567890.0123456,"shortExp":1.79e+308,"longExp":1.7976931348623157e+308}';

	await t.test('parses native BigInt values', () => {
		const object = parse(input);

		assert.equal(typeof object.small, 'number', 'small int type');
		assert.equal(object.small.toString(), '123', 'small int value');

		assert.equal(typeof object.big, 'bigint', 'big int type');
		assert.equal(object.big.toString(), '92233720368547758070', 'big int value');
	});

	await t.test('parses numbers as BigInt when preferParseAsBigInt is true', () => {
		const object = parse(input, undefined, { preferParseAsBigInt: true });

		assert.equal(typeof object.small, 'bigint', 'small int type');
		assert.equal(object.small.toString(), '123', 'small int value');

		assert.equal(typeof object.big, 'bigint', 'big int value');
		assert.equal(object.big.toString(), '92233720368547758070', 'big int type');
	});

	await t.test('roundtrips decimal and scientific notation', () => {
		const object = parse(input);

		assert.equal(typeof object.deci, 'number', 'decimal number type');
		assert.equal(object.deci.toString(), '1234567890.0123456', 'decimal number');

		assert.equal(typeof object.shortExp, 'number', 'short exponential number type');
		assert.equal(object.shortExp.toString(), '1.79e+308', 'short exponential number');

		assert.equal(typeof object.longExp, 'number', 'long exponential number type');
		assert.equal(object.longExp.toString(), '1.7976931348623157e+308', 'long exponential number');


		const output = stringify(object);

		assert.equal(output, input);
	});

	await t.test('roundtrips native BigInt values', () => {
		const object = parse(input);
		const output = stringify(object);

		assert.equal(output, input);
	});

	await t.test('roundtrips BigInt with preferParseAsBigInt option', () => {
		const object = parse(input, undefined, { preferParseAsBigInt: true });
		const output = stringify(object);

		assert.equal(output, input);
	});
});
