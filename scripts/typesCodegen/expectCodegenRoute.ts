import { type MaybeArray } from "@scripts/utils/maybeArray";

export type AllowedTypeValue = string | number | Date;

export interface ExpectCodegenRouteReponse {
	code: number;
	information: undefined | string;
	body?: unknown;
}

export interface ExpectCodegenRoute {
	method: string;
	path: string;
	headers?: Record<string, MaybeArray<AllowedTypeValue>>;
	params?: Record<string, AllowedTypeValue>;
	query?: Record<string, MaybeArray<AllowedTypeValue>>;
	body?: unknown;
	response: ExpectCodegenRouteReponse;
}

