export type ObjectCanBeEmpty<
	GenericValue extends object,
> = ({
	[Prop in keyof GenericValue]-?:
	undefined extends GenericValue[Prop]
		? true
		: false
}[keyof GenericValue]) extends true
	? true
	: false;
