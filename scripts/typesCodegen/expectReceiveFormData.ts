import { type MaybeArray } from "@scripts/utils/maybeArray";

export interface ExpectReceiveFormData<
	GenericValue extends Record<string, MaybeArray<string | number | Date> | File[]>,
> {
	extractor(...args: any[]): Promise<GenericValue>;
}
