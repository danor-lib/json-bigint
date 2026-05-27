import assert from 'node:assert/strict';
import test from 'node:test';

import { parse } from '../index.js';



test('__proto__ and constructor assignment handling', async (t) => {
	if(!BigInt) { throw new Error('No native BigInt. Test is break...'); }


	await t.test('sets __proto__ property without changing prototype when protoAction is preserve', () => {
		const object1 = parse('{ "__proto__": 1000000000000000 }', null, { protoAction: 'preserve' });

		assert.equal(Object.getPrototypeOf(object1), Object.prototype);


		const object2 = parse('{ "__proto__": { "admin": true } }', null, { protoAction: 'preserve' });

		assert.equal(object2.admin, true);
		assert.equal(Object.getPrototypeOf(object2).admin, true);
	});

	await t.test('throws when protoAction is invalid', () => {
		assert.throws(() =>
			parse('{ "__proto__": 1000000000000000 }', undefined, { protoAction: 'invalid value' }),
			{ code: 'invalid-type-option-protoAction', at: 'json-bigint/parse(3:options)' }
		);
	});

	await t.test('throws when constructorAction is invalid', () => {
		assert.throws(() =>
			parse('{ "__proto__": 1000000000000000 }', undefined, { constructorAction: 'invalid value' }),
			{ code: 'invalid-type-option-constructorAction', at: 'json-bigint/parse(3:options)' }
		);
	});

	await t.test('throws when protoAction is error and __proto__ property exists', () => {
		assert.throws(() =>
			parse('{ "\\u005f_proto__": 1000000000000000 }', undefined, { protoAction: 'error' }),
			{ code: 'contain-forbidden-prototype', at: 'json-bigint/parse' }
		);
	});

	await t.test('throws when constructorAction is error and constructor property exists', () => {
		assert.throws(() =>
			parse('{ "constructor": 1000000000000000 }', undefined, { constructorAction: 'error' }),
			{ code: 'contain-forbidden-constructor', at: 'json-bigint/parse' }
		);
	});

	await t.test('ignores __proto__ when protoAction is ignore', () => {
		const object = parse(
			'{ "__proto__": 1000000000000000, "a" : 42, "nested": { "__proto__": false, "b": 43 } }',
			undefined,
			{ protoAction: 'ignore' }
		);

		assert.equal(Object.getPrototypeOf(object), Object.prototype);
		assert.deepEqual(object, { a: 42, nested: { b: 43 } });
	});

	await t.test('ignores constructor when constructorAction is ignore', () => {
		const object = parse(
			'{ "constructor": 1000000000000000, "a" : 42, "nested": { "constructor": false, "b": 43 } }',
			undefined,
			{ constructorAction: 'ignore' }
		);

		assert.deepEqual(object, { a: 42, nested: { b: 43 } });
	});
});
