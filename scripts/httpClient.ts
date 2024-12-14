import { type Hooks } from "./hook";
import { type Interceptor, PromiseRequest } from "./PromiseRequest";
import { type HttpClientRoute } from "./HttpClientRoute";
import { type GetResponseFromRequest, type GetRouteByAttribute } from "./utils/getRoute";
import { type ObjectCanBeEmpty } from "./utils/objectCanBeEmpty";
import { type SimplifyType } from "./utils/simplifyType";

export interface InitHttpClient {
	baseUrl?: string;
	keyToInformation?: string;
}

export type DefaultRequest = Omit<Partial<Request>, "path" | "method" | "body">;

export type Request<
	GenericRoute extends HttpClientRoute = HttpClientRoute,
> = Omit<GenericRoute, "response">
	& Omit<RequestInit, "method" | "body" | "headers">;

export type RequestParams<
	GenericRoute extends HttpClientRoute = HttpClientRoute,
	GenericMethod extends GenericRoute["method"] = string,
	GenericPath extends GenericRoute["path"] = string,
> = Omit<
	Request<
		GetRouteByAttribute<
			GenericRoute,
			{
				method: GenericMethod;
				path: GenericPath;
			}
		>
	>,
	"method" | "path"
>;

export type MaybeRequestParams<
	GenericRequestParams extends RequestParams,
> = ObjectCanBeEmpty<GenericRequestParams> extends true
	? [params?: GenericRequestParams]
	: [params: GenericRequestParams];

export class HttpClient<
	GenericRoute extends HttpClientRoute = HttpClientRoute,
> {
	public baseUrl: string;

	public defaultRequestParams: DefaultRequest = {};

	public keyToInformation: string;

	public hooks: Hooks = new Set();

	public interceptor: Interceptor = {
		request: (request) => request,
		response: (response) => response,
	};

	public constructor(params: InitHttpClient = {}) {
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
		GenericPath extends GetRouteByAttribute<GenericRoute, { method: "GET" }>["path"],
		GenericRequestParams extends SimplifyType<Omit<RequestParams<GenericRoute, "GET", GenericPath>, "body">>,
	>(
		path: GenericPath,
		...[params]: MaybeRequestParams<GenericRequestParams>
	): PromiseRequest<
			GetResponseFromRequest<GenericRoute, GenericRequestParams & {
				method: "GET";
				path: GenericPath;
			}>
		> {
		return this.request<any>({
			...params,
			method: "GET",
			path,
			body: undefined,
		});
	}

	public post<
		GenericPath extends GetRouteByAttribute<GenericRoute, { method: "POST" }>["path"],
		GenericRequestParams extends SimplifyType<RequestParams<GenericRoute, "POST", GenericPath>>,
	>(
		path: GenericPath,
		...[params]: MaybeRequestParams<GenericRequestParams>
	): PromiseRequest<
			GetResponseFromRequest<GenericRoute, GenericRequestParams & {
				method: "POST";
				path: GenericPath;
			}>
		> {
		return this.request<any>({
			...params,
			method: "POST",
			path,
		});
	}

	public patch<
		GenericPath extends GetRouteByAttribute<GenericRoute, { method: "PATCH" }>["path"],
		GenericRequestParams extends SimplifyType<RequestParams<GenericRoute, "PATCH", GenericPath>>,
	>(
		path: GenericPath,
		...[params]: MaybeRequestParams<GenericRequestParams>
	): PromiseRequest<
			GetResponseFromRequest<GenericRoute, GenericRequestParams & {
				method: "PATCH";
				path: GenericPath;
			}>
		> {
		return this.request<any>({
			...params,
			method: "PATCH",
			path,
		});
	}

	public put<
		GenericPath extends GetRouteByAttribute<GenericRoute, { method: "PUT" }>["path"],
		GenericRequestParams extends SimplifyType<RequestParams<GenericRoute, "PUT", GenericPath>>,
	>(
		path: GenericPath,
		...[params]: MaybeRequestParams<GenericRequestParams>
	): PromiseRequest<
			GetResponseFromRequest<GenericRoute, GenericRequestParams & {
				method: "PUT";
				path: GenericPath;
			}>
		> {
		return this.request<any>({
			...params,
			method: "PUT",
			path,
		});
	}

	public delete<
		GenericPath extends GetRouteByAttribute<GenericRoute, { method: "DELETE" }>["path"],
		GenericRequestParams extends SimplifyType<Omit<RequestParams<GenericRoute, "DELETE", GenericPath>, "body">>,
	>(
		path: GenericPath,
		...[params]: MaybeRequestParams<GenericRequestParams>
	): PromiseRequest<
			GetResponseFromRequest<GenericRoute, GenericRequestParams & {
				method: "DELETE";
				path: GenericPath;
			}>
		> {
		return this.request<any>({
			...params,
			method: "DELETE",
			path,
			body: undefined,
		});
	}
}
