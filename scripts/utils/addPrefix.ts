import { type HttpClientRoute } from "@scripts/httpClientRoute";
import { type SimplifyType } from "./simplifyType";

export type AddPrefix<
	GenericRoute extends HttpClientRoute,
	GenericPrefix extends string,
> = GenericRoute extends HttpClientRoute
	? SimplifyType<
		{ path: `${GenericPrefix}${GenericRoute["path"]}` }
		& Omit<GenericRoute, "path">
	>
	: never;

