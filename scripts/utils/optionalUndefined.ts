export type OptionalUndefined<
	GenericObject extends object,
> = {
	[Prop in keyof GenericObject as undefined extends GenericObject[Prop] ? Prop : never]?: GenericObject[Prop];
} & {
	[Prop in keyof GenericObject as undefined extends GenericObject[Prop] ? never : Prop]: GenericObject[Prop];
};
