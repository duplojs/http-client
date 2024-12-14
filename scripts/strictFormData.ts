export class StrictFormData<
	GenericValues extends Record<string, string | string[] | File[]>,
> extends FormData {
	public constructor(
		public data: Readonly<GenericValues>,
	) {
		super();

		Object.entries(<GenericValues>data).forEach(
			([key, value]) => {
				if (value instanceof Array) {
					value.forEach(
						(subValue) => void this.append(key, subValue),
					);
				} else {
					this.set(key, value);
				}
			},
		);
	}
}
