import { type HttpClientRoute } from "@scripts/httpClientRoute";

export type FindHttpClientRouteResponse<
	GenericRoute extends HttpClientRoute,
	GenericKey extends Exclude<keyof GenericRoute["response"], "body">,
	GenericValue extends GenericRoute["response"][GenericKey],
> = Extract<
	GenericRoute["response"],
	{ [Prop in GenericKey]: GenericValue }
>;
