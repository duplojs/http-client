export type GetPropertiesWithNeverValue<
	GenericObject extends object,
> = {
	[Prop in keyof GenericObject]: [GenericObject[Prop]] extends [never] ? Prop : never
}[keyof GenericObject];

export type RemoveNeverProperties<
	GenericObject extends object,
> = Omit<
	GenericObject,
	GetPropertiesWithNeverValue<GenericObject>
>;
