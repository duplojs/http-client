import { type HttpClientRoute } from "@scripts/HttpClientRoute";

export type FindHttpClinteRoute<
	GenericRoute extends HttpClientRoute,
	GenericMethod extends GenericRoute["method"],
	GenericPath extends Extract<GenericRoute, { method: GenericMethod }>["path"],
> = Extract<
	GenericRoute,
	{
		method: GenericMethod;
		path: GenericPath;
	}
>;
