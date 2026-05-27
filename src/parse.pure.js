import { RichError } from '@danor-lib/error';

/** @import { ParseOption, Reviver } from '../types.ts' */



const charsEscape = {
	'"': '"',
	'\\': '\\',
	'/': '/',
	b: '\b',
	f: '\f',
	n: '\n',
	r: '\r',
	t: '\t',
};

const regexpProtoKey = /^(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])$/;
const regexpConstructorKey = /^(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)$/;


/**
 * Convert a JavaScript Object Notation (JSON) string into an object
 * @param {string} text A valid JSON string
 * @param {Reviver} [reviver] A function that transforms the results. This function is called for each member of the object
 * - If a member contains nested objects, the nested objects are transformed before the parent object is transformed
 * @param {ParseOption} [options] The option for parsing JSON string
 */
export function parse(text, reviver, options) {
	const optionFinal = {
		preferParseAsBigInt: Boolean(options?.preferParseAsBigInt ?? false),
		preferBigIntString: Boolean(options?.preferBigIntString ?? false),
		protoAction: String(options?.protoAction ?? 'error'),
		constructorAction: String(options?.constructorAction ?? 'error'),
	};

	if(
		optionFinal.protoAction != 'error' &&
		optionFinal.protoAction != 'ignore' &&
		optionFinal.protoAction != 'preserve'
	) {
		throw new RichError({
			code: 'invalid-type-option-protoAction', at: 'json-bigint/parse(3:options)',
			data: { protoAction: optionFinal.protoAction, option: options },
		});
	}

	if(
		optionFinal.constructorAction != 'error' &&
		optionFinal.constructorAction != 'ignore' &&
		optionFinal.constructorAction != 'preserve'
	) {
		throw new RichError({
			code: 'invalid-type-option-constructorAction', at: 'json-bigint/parse(3:options)',
			data: { constructorAction: optionFinal.constructorAction, option: options },
		});
	}



	const stringText = String(text);

	/** The index of the current character */
	let indexChar = 0;
	/** The current character */
	let charNow = ' ';

	/** skip whitespace */
	const skipWhite = () => {
		while(charNow && charNow <= ' ') {
			next();
		}
	};

	const next = (c) => {
		// If a c parameter is provided, verify that it matches the current character.
		if(c && c !== charNow) {
			throw new RichError({
				code: 'unexpected-char', at: 'json-bigint/parse',
				data: { char: charNow, index: indexChar, charExpected: c },
			});
		}

		// Get the next character. When there are no more characters,
		// return the empty string.

		charNow = stringText.charAt(indexChar);
		indexChar += 1;

		return charNow;
	};


	const parseNumber = () => {
		let stringNumber = '';

		if(charNow == '-') {
			stringNumber = '-';
			next('-');
		}

		while(charNow >= '0' && charNow <= '9') {
			stringNumber += charNow;
			next();
		}

		if(charNow == '.') {
			stringNumber += '.';

			while(next() && charNow >= '0' && charNow <= '9') {
				stringNumber += charNow;
			}
		}

		if(charNow == 'e' || charNow == 'E') {
			stringNumber += charNow;
			next();
			if(charNow == '-' || charNow == '+') {
				stringNumber += charNow;
				next();
			}
			while(charNow >= '0' && charNow <= '9') {
				stringNumber += charNow;
				next();
			}
		}


		const number = Number(stringNumber);


		if(!isFinite(number)) {
			throw new RichError({
				code: 'bad-number', at: 'json-bigint/parse',
				data: { string: stringNumber, index: indexChar },
			});
		}

		if(Number.isSafeInteger(number)) {
			return optionFinal.preferParseAsBigInt ? BigInt(number) : number;
		}

		// Number with fractional part should be treated as number(double) including big integers in scientific notation, i.e 1.79e+308
		return optionFinal.preferBigIntString
			? stringNumber
			: /[.eE]/.test(stringNumber)
				? number
				: BigInt(stringNumber);
	};

	// When parsing for string values, we must look for " and \ characters.
	const parseString = () => {
		const indexStart = indexChar;


		let string = '';

		if(charNow == '"') {
			let indexNow = indexChar;

			while(next()) {
				if(charNow == '"') {
					if(indexChar - 1 > indexNow) { string += stringText.substring(indexNow, indexChar - 1); }

					next();

					return string;
				}

				if(charNow == '\\') {
					if(indexChar - 1 > indexNow) { string += stringText.substring(indexNow, indexChar - 1); }

					next();

					if(charNow == 'u') {
						let uffff = 0;

						for(let i = 0; i < 4; i++) {
							const hex = parseInt(next(), 16);

							if(!isFinite(hex)) { break; }

							uffff = uffff * 16 + hex;
						}

						string += String.fromCharCode(uffff);
					}
					else if(typeof charsEscape[charNow] == 'string') {
						string += charsEscape[charNow];
					}
					else {
						break;
					}

					indexNow = indexChar;
				}
			}
		}

		throw new RichError({
			code: 'bad-string', at: 'json-bigint/parse',
			data: { string: stringText.substring(indexStart - 1, indexChar - 1), index: indexChar },
		});
	};



	// true, false, or null.
	const parseWord = () => {
		switch(charNow) {
			case 't': {
				next('t'); next('r'); next('u'); next('e');

				return true;
			}
			case 'f': {
				next('f'); next('a'); next('l'); next('s'); next('e');

				return false;
			}
			case 'n': {
				next('n'); next('u'); next('l'); next('l');

				return null;
			}
		}

		throw new RichError({
			code: 'unexpected-word', at: 'json-bigint/parse',
			data: { char: charNow, index: indexChar },
		});
	};


	const parseArray = () => {
		const indexStart = indexChar;


		const array = [];

		if(charNow == '[') {
			next('[');
			skipWhite();

			if(charNow == ']') {
				next(']');

				return array;
			}

			while(charNow) {
				array.push(parseValue());
				skipWhite();

				if(charNow == ']') {
					next(']');

					return array;
				}

				next(',');
				skipWhite();
			}
		}

		throw new RichError({
			code: 'bad-array', at: 'json-bigint/parse',
			data: { string: stringText.substring(indexStart - 1, indexChar - 1), index: indexChar },
		});
	};

	const parseObject = () => {
		const indexStart = indexChar;


		const object = {};

		if(charNow == '{') {
			next('{');
			skipWhite();

			if(charNow == '}') {
				next('}');

				return object;
			}

			while(charNow) {
				const key = parseString();

				skipWhite();
				next(':');

				if(regexpProtoKey.test(key)) {
					if(optionFinal.protoAction == 'error') {
						throw new RichError({
							code: 'contain-forbidden-prototype', at: 'json-bigint/parse',
							data: { key, index: indexChar },
						});
					}
					else if(optionFinal.protoAction == 'ignore') {
						parseValue();
					}
					else {
						object[key] = parseValue();
					}
				}
				else if(regexpConstructorKey.test(key)) {
					if(optionFinal.constructorAction == 'error') {
						throw new RichError({
							code: 'contain-forbidden-constructor', at: 'json-bigint/parse',
							data: { key, index: indexChar },
						});
					}
					else if(optionFinal.constructorAction == 'ignore') {
						parseValue();
					}
					else {
						object[key] = parseValue();
					}
				}
				else {
					object[key] = parseValue();
				}

				skipWhite();

				if(charNow == '}') {
					next('}');

					return object;
				}

				next(',');
				skipWhite();
			}
		}

		throw new RichError({
			code: 'bad-object', at: 'json-bigint/parse',
			data: { string: stringText.substring(indexStart - 1, indexChar - 1), index: indexChar },
		});
	};

	/** Place holder for the value function */
	const parseValue = () => {
		skipWhite();

		switch(charNow) {
			case '{': {
				return parseObject();
			}
			case '[': {
				return parseArray();
			}
			case '"': {
				return parseString();
			}
			case '-': {
				return parseNumber();
			}
			default: {
				return charNow >= '0' && charNow <= '9' ? parseNumber() : parseWord();
			}
		}
	};


	const result = parseValue();

	skipWhite();
	if(charNow) {
		throw new RichError({
			code: 'unexpected-word', at: 'json-bigint/parse',
			data: { char: charNow, index: indexChar },
		});
	}


	if(typeof reviver == 'function') {
		const walk = (holder, key) => {
			const value = holder[key];

			if(value && typeof value == 'object') {
				Object.keys(value).forEach((k) => {
					const v = walk(value, k);

					if(v !== undefined) {
						value[k] = v;
					}
					else {
						delete value[k];
					}
				});
			}

			return reviver.call(holder, key, value);
		};

		return walk({ '': result }, '');
	}


	return result;
}
