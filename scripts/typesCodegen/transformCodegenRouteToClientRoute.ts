import { type StrictFormData } from "@scripts/strictFormData";
import { type ExpectCodegenRouteReponse, type ExpectCodegenRoute } from "./expectCodegenRoute";
import { type ExpectReceiveFormData } from "./expectReceiveFormData";
import { type RemoveNeverProperties } from "./removeNeverProperties";
import { type SimplifyType } from "@scripts/utils/simplifyType";
import { type IsEqual } from "@scripts/utils/isEqual";

export type ReplaceTypeToString<
	GenericValue extends unknown,
	GenericType extends unknown,
> = GenericValue extends GenericType
	? string
	: GenericValue extends Record<number, unknown>
		? { [Prop in keyof GenericValue]: ReplaceTypeToString<GenericValue[Prop], GenericType> }
		: GenericValue;

export type transformCodegenBodyToHttpClientBody<
	GenericBody extends unknown,
> = GenericBody extends number | Date
	? string
	: GenericBody extends ExpectReceiveFormData<infer InferedValues>
		? StrictFormData<
			ReplaceTypeToString<InferedValues, number | Date>
		>
		: ReplaceTypeToString<
			GenericBody,
			Date
		>;

export type TransformCodegenRouteResponseToHttpClientRouteResponse<
	GenericResponse extends ExpectCodegenRouteReponse,
> = SimplifyType<
	GenericResponse extends ExpectCodegenRouteReponse
		? {
			code: GenericResponse["code"];
			information: GenericResponse["information"];
			body: transformCodegenBodyToHttpClientBody<GenericResponse["body"]>;
			ok: GenericResponse["ok"];
		}
		: never
>;

export type TransformCodegenRouteToHttpClientRoute<
	GenericCodegenRoute extends ExpectCodegenRoute,
> = SimplifyType<
	GenericCodegenRoute extends ExpectCodegenRoute
		? RemoveNeverProperties<{
			method: GenericCodegenRoute["method"];
			path: GenericCodegenRoute["path"];
			headers: IsEqual<GenericCodegenRoute["headers"], unknown> extends true
				? never
				: ReplaceTypeToString<GenericCodegenRoute["headers"], Date | number>;
			params: IsEqual<GenericCodegenRoute["params"], unknown> extends true
				? never
				: ReplaceTypeToString<GenericCodegenRoute["params"], Date | number>;
			query: IsEqual<GenericCodegenRoute["query"], unknown> extends true
				? never
				: ReplaceTypeToString<GenericCodegenRoute["query"], Date | number>;
			body: IsEqual<GenericCodegenRoute["body"], unknown> extends true
				? never
				: transformCodegenBodyToHttpClientBody<GenericCodegenRoute["body"]>;
			response: TransformCodegenRouteResponseToHttpClientRouteResponse<GenericCodegenRoute["response"]>;
		}>
		: never
>;

