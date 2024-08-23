/**
 * Converts a JavaScript Object Notation (JSON) string into an object.
 * @param {string} text A valid JSON string.
 * @param {import('../bases.d.ts').Reviver} reviver A function that transforms the results. This function is called for each member of the object.
 * - If a member contains nested objects, the nested objects are transformed before the parent object is.
 * @param {import('../bases.d.ts').ParseOption} option
 */
export default function parse(text: string, reviver: import("../bases.d.ts").Reviver, option: import("../bases.d.ts").ParseOption): any;
