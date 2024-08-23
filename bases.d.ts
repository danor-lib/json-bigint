export type Reviver = (this: any, key: string, value: any) => any;
export type Replacer = (this: any, key: string, value: any) => any;

export type ParseOption = {
	preferParseAsBigInt: boolean;
	preferBigIntString: boolean;
	protoAction: 'error' | 'ignore' | 'preserve';
	constructorAction: 'error' | 'ignore' | 'preserve';
}
