import { type Hooks } from "./hook";
import { type Interceptor, PromiseRequest } from "./PromiseRequest";
import { type Route } from "./route";
import { type GetRouteByMethod, type GetResponseFromRequest } from "./utils/getRoute";

export interface InitDuploTo {
	baseUrl?: string;
	keyToInformation?: string;
}

export type DefaultRequest = Omit<Partial<Request>, "path" | "method" | "body">;

export type Request<
	GenericRoute extends Route = Route,
> = Omit<GenericRoute, "response">
	& Omit<RequestInit, "method" | "body" | "headers">;

export class DuploTo<
	GenericRoute extends Route = Route,
> {
	public baseUrl: string;

	public defaultRequestParams: DefaultRequest = {};

	public keyToInformation: string;

	public hooks: Hooks = new Set();

	public interceptor: Interceptor = {
		request: (request) => request,
		response: (response) => response,
	};

	public constructor(params: InitDuploTo = {}) {
		this.baseUrl = params.baseUrl ?? "";

		this.keyToInformation = params.keyToInformation ?? "information";
	}

	public setDefaultRequestParams(requestParams: DefaultRequest) {
		this.defaultRequestParams = requestParams;

		return this;
	}

	public setInterceptor<
		GenericKey extends keyof Interceptor,
	>(key: GenericKey, callback: Interceptor[GenericKey]) {
		this.interceptor[key] = callback;

		return this;
	}

	public request<
		GenericRequest extends Request<GenericRoute>,
	>(
		{
			method,
			path,
			params,
			query,
			headers,
			body,
			...paramsRequest
		}: GenericRequest,
	) {
		const {
			headers: defaultHeaders,
			params: defaultParams,
			query: defaultQuery,
			...defaultParamsRequest
		} = this.defaultRequestParams;

		return new PromiseRequest<
			GetResponseFromRequest<GenericRoute, GenericRequest>
		>({
			...this.defaultRequestParams,
			method,
			path: path.startsWith("/") ? path : `/${path}`,
			baseUrl: this.baseUrl,
			paramsRequest: {
				...defaultParamsRequest,
				...paramsRequest,
			},
			headers: {
				...defaultHeaders,
				...headers,
			},
			params: {
				...defaultParams,
				...params,
			},
			query: {
				...defaultQuery,
				...query,
			},
			body,
			keyToInformation: this.keyToInformation,
			hooks: this.hooks,
			interceptor: this.interceptor,
		});
	}

	public get<
		GenericRequest extends Omit<
			Request<GetRouteByMethod<GenericRoute, "GET">>,
			"method" | "body"
		>,
	>(
		params: GenericRequest,
	): PromiseRequest<
			GetResponseFromRequest<GenericRoute, GenericRequest & { method: "GET" }>
		> {
		return this.request<any>({
			...params,
			method: "GET",
			body: undefined,
		});
	}

	public post<
		GenericRequest extends Omit<
			Request<GetRouteByMethod<GenericRoute, "POST">>,
			"method"
		>,
	>(
		params: GenericRequest,
	): PromiseRequest<
			GetResponseFromRequest<GenericRoute, GenericRequest & { method: "POST" }>
		> {
		return this.request<any>({
			...params,
			method: "POST",
		});
	}

	public patch<
		GenericRequest extends Omit<
			Request<GetRouteByMethod<GenericRoute, "PATCH">>,
			"method"
		>,
	>(
		params: GenericRequest,
	): PromiseRequest<
			GetResponseFromRequest<GenericRoute, GenericRequest & { method: "PATCH" }>
		> {
		return this.request<any>({
			...params,
			method: "PATCH",
		});
	}

	public put<
		GenericRequest extends Omit<
			Request<GetRouteByMethod<GenericRoute, "PUT">>,
			"method"
		>,
	>(
		params: GenericRequest,
	): PromiseRequest<
			GetResponseFromRequest<GenericRoute, GenericRequest & { method: "PUT" }>
		> {
		return this.request<any>({
			...params,
			method: "PUT",
		});
	}

	public delete<
		GenericRequest extends Omit<
			Request<GetRouteByMethod<GenericRoute, "DELETE">>,
			"method"
		>,
	>(
		params: GenericRequest,
	): PromiseRequest<
			GetResponseFromRequest<GenericRoute, GenericRequest & { method: "DELETE" }>
		> {
		return this.request<any>({
			...params,
			method: "DELETE",
			body: undefined,
		});
	}
}
