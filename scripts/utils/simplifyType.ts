export type SimplifyType<
	GenericValue extends unknown,
> = GenericValue extends Record<number, unknown>
	? {
		[Props in keyof GenericValue]: SimplifyType<GenericValue[Props]>
	}
	: GenericValue;
