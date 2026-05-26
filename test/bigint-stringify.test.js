import assert from 'node:assert/strict';
import test from 'node:test';

import { stringify } from '../index.js';



test('native BigInt stringify support', async (t) => {
	if(!BigInt) { throw new Error('No native BigInt. Test is break...'); }


	await t.test('JSONBigInt can stringify native BigInt', () => {
		const object = {
			// We cannot use n-literals - otherwise older NodeJS versions fail on this test
			big: eval('123456789012345678901234567890n'),
			small: -42,
			bigConstructed: BigInt(1),
			smallConstructed: Number(2),
		};

		assert.equal(typeof object.big, 'bigint', 'typeof big int type');
		assert.equal(object.small.toString(), '-42', 'string from small int value');
		assert.equal(object.big.toString(), '123456789012345678901234567890', 'string from big int value');


		const output = stringify(object);

		assert.equal(output,
			'{' +
			'"big":123456789012345678901234567890,' +
			'"small":-42,' +
			'"bigConstructed":1,' +
			'"smallConstructed":2' +
			'}'
		);
	});
});
