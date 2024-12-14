export type IsEqual<
	GenericFirst extends unknown,
	GenericSecond extends unknown,
> = (<V>() => V extends GenericFirst ? 1 : 2) extends (<V>() => V extends GenericSecond ? 1 : 2)
	? true
	: false;
