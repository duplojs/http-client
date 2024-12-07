import { getCodeHooks, getErrorHooks, getInformationHooks, type Hooks, type GeneralHook, getGeneralHooks, type ErrorHook } from "./hook";
import { getBody } from "./utils/getBody";
import { insertParamsInPath } from "./utils/insertParamsInPath";
import { queryToString } from "./utils/queryToString";
import { type GetResponseByInformation, type GetResponseByCode, type GetResponseByStatus } from "./utils/getResponse";
import { WrongResponseError } from "./WrongResponseError";
import { type GetCallbackCodeHook, type GetCallbackGeneralHook, type GetCallbackInformationHook } from "./utils/getCallbackHook";
import { type RouteResponse } from "./route";

export interface Interceptor {
	request(request: RequestDefinition): RequestDefinition | Promise<RequestDefinition>;
	response(response: Response): Response | Promise<Response>;
}

export interface RequestDefinition {
	method: string;
	path: string;
	baseUrl: string;
	keyToInformation: string;
	paramsRequest: Omit<RequestInit, "headers">;
	headers?: Partial<Record<string, string>>;
	params?: Partial<Record<string, string | number>>;
	query?: Partial<Record<string, string | string[] | number>>;
	body?: unknown;
	hooks: Hooks;
	interceptor: Interceptor;
}

export type Response<
	GenericRouteResponse extends RouteResponse = RouteResponse,
> = GenericRouteResponse & {
	headers: Headers;
	type: ResponseType;
	url: string;
	redirected: boolean;
};

export class PromiseRequest<
	GenericRouteResponse extends RouteResponse,
> extends Promise<
		Response<GenericRouteResponse>
	> {
	private hooks: Hooks;

	public static get [Symbol.species]() {
		return Promise;
	}

	public constructor(
		public definition: RequestDefinition,
	) {
		super(
			(resolve, reject) => void Promise
				.resolve(definition)
				.then(definition.interceptor.request)
				.then(PromiseRequest.fetch)
				.then(definition.interceptor.response)
				.then((response) => {
					if (response.code >= 200 && response.code <= 299) {
						for (const hook of getGeneralHooks(this.hooks, 200)) {
							hook.callback(response);
						}
					} else if (response.code >= 400 && response.code <= 499) {
						for (const hook of getGeneralHooks(this.hooks, 400)) {
							hook.callback(response);
						}
					} else if (response.code >= 500 && response.code <= 599) {
						for (const hook of getGeneralHooks(this.hooks, 500)) {
							hook.callback(response);
						}
					}

					if (response.information) {
						for (const hook of getInformationHooks(this.hooks, response.information)) {
							hook.callback(response);
						}
					}

					for (const hook of getCodeHooks(this.hooks, response.code)) {
						hook.callback(response);
					}

					return <Response<GenericRouteResponse>>response;
				})
				.then(resolve)
				.catch((error) => {
					for (const hook of getErrorHooks(this.hooks)) {
						hook.callback(error);
					}

					reject(error);
				})
				.catch(reject),
		);

		this.hooks = new Set(definition.hooks);
	}

	public whenInformation<
		GenericInformation extends Extract<
			Response<GenericRouteResponse>["information"],
			string
		>,
	>(
		information: GenericInformation,
		callback: GetCallbackInformationHook<
			Response<GenericRouteResponse>,
			GenericInformation
		>,
	) {
		this.hooks.add({
			type: "information",
			value: information,
			callback: <never>callback,
		});

		return this;
	}

	public whenCode<
		GenericCode extends Response<GenericRouteResponse>["code"],
	>(
		code: `${GenericCode}`,
		callback: GetCallbackCodeHook<
			Response<GenericRouteResponse>,
			GenericCode
		>,
	) {
		this.hooks.add({
			type: "code",
			value: Number(code),
			callback: <never>callback,
		});

		return this;
	}

	public whenRequestError(
		callback: GetCallbackGeneralHook<
			Response<GenericRouteResponse>,
			false
		>,
	) {
		this.hooks.add({
			type: "general",
			value: 400,
			callback: <never>callback,
		});

		return this;
	}

	public whenResponseSuccess(
		callback: GetCallbackGeneralHook<
			Response<GenericRouteResponse>,
			true
		>,
	) {
		this.hooks.add({
			type: "general",
			value: 200,
			callback: <never>callback,
		});

		return this;
	}

	public whenServerError(callback: GeneralHook["callback"]) {
		this.hooks.add({
			type: "general",
			value: 500,
			callback: <never>callback,
		});

		return this;
	}

	public whenError(callback: ErrorHook["callback"]) {
		this.hooks.add({
			type: "error",
			callback: <never>callback,
		});

		return this;
	}

	public IWantInformation<
		GenericInformation extends Extract<
			Response<GenericRouteResponse>["information"],
			string
		>,
	>(information: GenericInformation): Promise<
		GetResponseByInformation<
			Response<GenericRouteResponse>,
			GenericInformation
		>
	> {
		return this.then(
			(response: Response) => {
				if (response.information === information) {
					return <any>response;
				} else {
					throw new WrongResponseError(response);
				}
			},
		);
	}

	public IWantCode<
		GenericCode extends Response<GenericRouteResponse>["code"],
	>(code: `${GenericCode}`): Promise<
		GetResponseByCode<
			Response<GenericRouteResponse>,
			GenericCode
		>
	> {
		return this.then(
			(response: Response) => {
				if (response.code === Number(code)) {
					return <never>response;
				} else {
					throw new WrongResponseError(response);
				}
			},
		);
	}

	public IWantRequestError(): Promise<
		GetResponseByStatus<
			Response<GenericRouteResponse>,
			false
		>
	> {
		return this.then(
			(response: Response) => {
				if (response.code >= 400 && response.code <= 499) {
					return <never>response;
				} else {
					throw new WrongResponseError(response);
				}
			},
		);
	}

	public IWantResponseSuccess(): Promise<
		GetResponseByStatus<
			Response<GenericRouteResponse>,
			true
		>
	> {
		return this.then(
			(response: Response) => {
				if (response.code >= 200 && response.code <= 299) {
					return <never>response;
				} else {
					throw new WrongResponseError(response);
				}
			},
		);
	}

	public IWantServerError() {
		return this.then(
			(response: Response) => {
				if (response.code >= 500 && response.code <= 599) {
					return response;
				} else {
					throw new WrongResponseError(response);
				}
			},
		);
	}

	public static fetch(definition: RequestDefinition): Promise<Response> {
		const url = [
			insertParamsInPath(definition.path, definition.params),
			queryToString(definition.query),
		]
			.filter(Boolean)
			.join("?");

		if (definition.body) {
			const headers: RequestDefinition["headers"] = {
				...definition.headers,
			};

			if (!headers["content-type"]) {
				if (typeof definition.body === "string" || typeof definition.body === "number") {
					headers["content-type"] = "text/plain; charset=utf-8";
				} else if (
					definition.body
					&& typeof definition.body === "object"
					&& definition.body.constructor.name === "Object"
				) {
					headers["content-type"] = "application/json; charset=utf-8";
					definition.body = JSON.stringify(definition.body);
				}
			}

			definition.headers = headers;
		}

		return fetch(
			`${definition.baseUrl}${url}`,
			{
				...definition.paramsRequest,
				headers: <any>definition.headers,
				method: definition.method,
				body: <any>definition.body,
			},
		)
			.then(
				(response) => getBody(response)
					.then((body) => ({
						body,
						information: response.headers.get(definition.keyToInformation) || undefined,
						code: response.status,
						ok: response.ok,
						headers: response.headers,
						type: response.type,
						url: response.url,
						redirected: response.redirected,
					})),
			);
	}
}
