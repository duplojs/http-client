import { type Request } from "@scripts/httpClient";
import { type Response } from "@scripts/PromiseRequest";
import { type HttpClientRoute } from "@scripts/httpClientRoute";

export type GetResponseFromRequest<
	GenericRoute extends HttpClientRoute,
	GenericRequest extends Request,
> = [Extract<GenericRoute, {
	method: GenericRequest["method"];
	path: GenericRequest["path"];
}>] extends [never]
	? Response
	: Extract<GenericRoute, {
		method: GenericRequest["method"];
		path: GenericRequest["path"];
	}>["response"];

export type GetRouteByAttribute<
	GenericRoute extends HttpClientRoute,
	GenericAttribute extends Partial<
		Pick<HttpClientRoute, "method" | "path">
	>,
> = [Extract<GenericRoute, GenericAttribute>] extends [never]
	? HttpClientRoute
	: Extract<GenericRoute, GenericAttribute>;
