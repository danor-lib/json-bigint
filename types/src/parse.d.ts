import type { Reviver, ParseOption } from '../types.ts';



/**
 * Convert a JavaScript Object Notation (JSON) string into an object
 * @param {string} text A valid JSON string
 * @param {Reviver} [reviver] A function that transforms the results. This function is called for each member of the object
 * - If a member contains nested objects, the nested objects are transformed before the parent object is transformed
 * @param {ParseOption} [option] The option for parsing JSON string
 */
export function parse(text: string, reviver?: Reviver, option?: ParseOption): any;
