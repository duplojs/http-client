import { type HttpClientRoute } from "@scripts/httpClientRoute";
import { type SimplifyType } from "./simplifyType";

export type RemovePrefix<
	GenericRoute extends HttpClientRoute,
	GenericPrefix extends string,
> = GenericRoute extends HttpClientRoute
	? GenericRoute["path"] extends `${GenericPrefix}${infer inferedPathRest}`
		? SimplifyType<
			{ path: inferedPathRest }
			& Omit<GenericRoute, "path">
		>
		: GenericRoute
	: never;

