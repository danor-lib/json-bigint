import assert from 'node:assert/strict';
import test from 'node:test';

import { parse } from '../index.js';



test('"preferBigIntString" option', async (t) => {
	if(!BigInt) { throw new Error('No native BigInt. Test is break...'); }


	const input = '{ "key": 12345678901234567 }';

	await t.test('parses the key as bigint by default', () => {
		const result = parse(input);

		assert.equal(typeof result.key, 'bigint');
	});

	await t.test('parses the key as string when preferBigIntString is true', () => {
		const result = parse(input, undefined, { preferBigIntString: true });

		assert.equal(typeof result.key, 'string');
	});
});
