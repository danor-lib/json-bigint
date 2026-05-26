import assert from 'node:assert/strict';
import test from 'node:test';

import { parse, stringify } from '../index.js';



test('bigint support', async (t) => {
	if(!BigInt) { throw new Error('No native BigInt. Test is break...'); }


	const input = '{"big":9223372036854775807,"small":123}';

	await t.test('classic JSON.parse lacks bigint support', () => {
		const object = JSON.parse(input);

		assert.equal(object.small.toString(), '123', 'string from small int value');
		assert.notEqual(object.big.toString(), '9223372036854775807', 'string from big int value');


		const output = JSON.stringify(object);

		assert.notEqual(output, input);
	});

	await t.test('JSONBigInt supports bigint parse/stringify roundtrip', () => {
		const object = parse(input);

		assert.equal(object.small.toString(), '123', 'string from small int value');
		assert.equal(object.big.toString(), '9223372036854775807', 'string from big int value');
		assert.equal(typeof object.big, 'bigint', 'typeof big int type');


		const output = stringify(object);

		assert.equal(output, input);
	});
});
