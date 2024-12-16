import { type HttpClientRoute } from "@scripts/httpClientRoute";

export type FindHttpClientRoute<
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
