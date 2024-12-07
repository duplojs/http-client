import { type Request } from "@scripts/duploTo";
import { type Response } from "@scripts/PromiseRequest";
import { type Route } from "@scripts/route";

export type GetResponseFromRequest<
	GenericRoute extends Route,
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

export type GetRouteByMethod<
	GenericRoute extends Route,
	GenericMethod extends Route["method"],
> = [Extract<GenericRoute, { method: GenericMethod }>] extends [never]
	? Route
	: Extract<GenericRoute, { method: GenericMethod }>;
