import type { Replacer } from '../types.ts';



/**
 * Convert a JavaScript value to a JavaScript Object Notation (JSON) string
 * @param {any} value The value to convert to a JSON string
 * @param {Replacer} [replacer] A function that transforms the results. This function is called for each member of the object
 * @param {string|number} [space] A string or number that's used to insert white space into the output JSON string for readability purposes
 * - If this is a number, it indicates the number of space characters to use as white space
 * - If this is a string, it contains the characters used as white space
 * - If this parameter is not provided (or is null), no white space is used
 * @returns {string}
 */
export function stringify(value: any, replacer?: Replacer, space?: string | number): string;
