import { getCodeHooks, getErrorHooks, getInformationHooks, type Hooks, type GeneralHook, getGeneralHooks, type ErrorHook, getExpectedResponseHooks } from "./hook";
import { getBody } from "./utils/getBody";
import { insertParamsInPath } from "./utils/insertParamsInPath";
import { queryToString } from "./utils/queryToString";
import { type GetResponseByInformation, type GetResponseByCode, type GetResponseByStatus } from "./utils/getResponse";
import { WrongResponseError } from "./WrongResponseError";
import { type GetCallbackExpectedResponseHook, type GetCallbackCodeHook, type GetCallbackGeneralHook, type GetCallbackInformationHook } from "./utils/getCallbackHook";
import { type HttpClientRouteResponse } from "./httpClientRoute";
import { type SimplifyType } from "./utils/simplifyType";
import { RequestError } from "./utils/requestError";
import { type HttpClientRequestInit } from "./utils/httpClientRequestInit";

export interface Interceptors {
	request(requestDefinition: RequestDefinition): RequestDefinition | Promise<RequestDefinition>;
	response(response: Response): Response | Promise<Response>;
}

export interface RequestDefinition {
	method: string;
	path: string;
	baseUrl: string;
	keyToInformation: string;
	paramsRequest: Omit<HttpClientRequestInit, "headers">;
	headers?: Partial<Record<string, string>>;
	params?: Partial<Record<string, string | number>>;
	query?: Partial<Record<string, string | string[] | number>>;
	body?: unknown;
	hooks: Hooks;
	interceptors: Interceptors;
}

export type Response<
	GenericRouteResponse extends HttpClientRouteResponse = HttpClientRouteResponse,
> = SimplifyType<
	GenericRouteResponse & {
		headers: Headers;
		type: ResponseType;
		url: string;
		redirected: boolean;
		raw: globalThis.Response;
		requestDefinition: RequestDefinition;
	}
>;

export class PromiseRequest<
	GenericRouteResponse extends HttpClientRouteResponse,
> extends Promise<
		Response<GenericRouteResponse>
	> {
	private hooks: Hooks;

	public static get [Symbol.species]() {
		return Promise;
	}

	public constructor(
		public requestDefinition: RequestDefinition,
	) {
		super(
			(resolve, reject) => void Promise
				.resolve(requestDefinition)
				.then(requestDefinition.interceptors.request)
				.then(PromiseRequest.fetch)
				.then((response) => requestDefinition.interceptors.response(response))
				.then((response) => {
					if (response.code >= 200 && response.code <= 299) {
						for (const hook of getGeneralHooks(this.hooks, 200)) {
							hook.callback(response);
						}
						for (const hook of getExpectedResponseHooks(this.hooks)) {
							hook.callback(response);
						}
					} else if (response.code >= 400 && response.code <= 499) {
						for (const hook of getGeneralHooks(this.hooks, 400)) {
							hook.callback(response);
						}
						for (const hook of getExpectedResponseHooks(this.hooks)) {
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
				.catch((error: unknown) => {
					for (const hook of getErrorHooks(this.hooks)) {
						hook.callback(error, requestDefinition);
					}

					reject(error);
				})
				.catch(reject),
		);

		this.hooks = new Set(requestDefinition.hooks);
	}

	public whenInformation<
		GenericInformation extends Extract<
			Response<GenericRouteResponse>["information"],
			string
		>,
	>(
		information: GenericInformation | GenericInformation[],
		callback: GetCallbackInformationHook<
			Response<GenericRouteResponse>,
			GenericInformation
		>,
	) {
		const formatedInformation
			= information instanceof Array
				? information
				: [information];

		formatedInformation.forEach(
			(information) => {
				this.hooks.add({
					type: "information",
					value: information,
					callback: <never>callback,
				});
			},
		);

		return this;
	}

	public whenCode<
		GenericCode extends Response<GenericRouteResponse>["code"],
	>(
		code: `${GenericCode}` | `${GenericCode}`[],
		callback: GetCallbackCodeHook<
			Response<GenericRouteResponse>,
			GenericCode
		>,
	) {
		const formatedCode
			= code instanceof Array
				? code
				: [code];

		formatedCode.forEach(
			(code) => {
				this.hooks.add({
					type: "code",
					value: Number(code),
					callback: <never>callback,
				});
			},
		);

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

	public whenExpectedResponse(
		callback: GetCallbackExpectedResponseHook<
			Response<GenericRouteResponse>
		>,
	) {
		this.hooks.add({
			type: "expectedResponse",
			callback: <never>callback,
		});

		return this;
	}

	public iWantInformation<
		GenericInformation extends Extract<
			Response<GenericRouteResponse>["information"],
			string
		>,
	>(information: GenericInformation | GenericInformation[]): Promise<
		GetResponseByInformation<
			Response<GenericRouteResponse>,
			GenericInformation
		>
	> {
		const formatedInformation
			= information instanceof Array
				? information
				: [information];

		return this.then(
			(response: Response) => {
				if (formatedInformation.includes(response.information as never)) {
					return <any>response;
				} else {
					throw new WrongResponseError(response, {
						expect: formatedInformation.join(" or "),
						receive: response.information ?? "undefined",
					});
				}
			},
		);
	}

	public iWantCode<
		GenericCode extends Response<GenericRouteResponse>["code"],
	>(
		code: `${GenericCode}` | `${GenericCode}`[],
	): Promise<
			GetResponseByCode<
				Response<GenericRouteResponse>,
				GenericCode
			>
		> {
		const formatedCode
			= code instanceof Array
				? code
				: [code];

		return this.then(
			(response: Response) => {
				if (formatedCode.includes(response.code.toString() as never)) {
					return <never>response;
				} else {
					throw new WrongResponseError(response, {
						expect: formatedCode.join(" or "),
						receive: response.code.toString(),
					});
				}
			},
		);
	}

	public iWantRequestError(): Promise<
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
					throw new WrongResponseError(response, {
						expect: "400 to 499",
						receive: response.code.toString(),
					});
				}
			},
		);
	}

	public iWantResponseSuccess(): Promise<
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
					throw new WrongResponseError(response, {
						expect: "200 to 299",
						receive: response.code.toString(),
					});
				}
			},
		);
	}

	public iWantServerError() {
		return this.then(
			(response: Response) => {
				if (response.code >= 500 && response.code <= 599) {
					return response;
				} else {
					throw new WrongResponseError(response, {
						expect: "500 to 599",
						receive: response.code.toString(),
					});
				}
			},
		);
	}

	public iWantExpectedResponse(): Promise<
		GetResponseByStatus<
			Response<GenericRouteResponse>,
			boolean
		>
	> {
		return this.then(
			(response: Response) => {
				if (
					(response.code >= 200 && response.code <= 299)
					|| (response.code >= 400 && response.code <= 499)
				) {
					return <never>response;
				} else {
					throw new WrongResponseError(response, {
						expect: "200 to 299 or 400 to 499",
						receive: response.code.toString(),
					});
				}
			},
		);
	}

	public static fetch(requestDefinition: RequestDefinition): Promise<Response> {
		const url = [
			insertParamsInPath(requestDefinition.path, requestDefinition.params),
			queryToString(requestDefinition.query),
		]
			.filter(Boolean)
			.join("?");

		if (requestDefinition.body) {
			const headers: RequestDefinition["headers"] = {
				...requestDefinition.headers,
			};

			if (!headers["content-type"]) {
				if (typeof requestDefinition.body === "string" || typeof requestDefinition.body === "number") {
					headers["content-type"] = "text/plain; charset=utf-8";
				} else if (
					requestDefinition.body
					&& typeof requestDefinition.body === "object"
					&& requestDefinition.body.constructor.name === "Object"
				) {
					headers["content-type"] = "application/json; charset=utf-8";
					requestDefinition.body = JSON.stringify(requestDefinition.body);
				}
			}

			requestDefinition.headers = headers;
		}

		return fetch(
			`${requestDefinition.baseUrl}${url}`,
			{
				...requestDefinition.paramsRequest,
				headers: <any>requestDefinition.headers,
				method: requestDefinition.method,
				body: <any>requestDefinition.body,
			},
		)
			.then(
				(response) => getBody(response)
					.then((body) => ({
						body,
						information: response.headers.get(requestDefinition.keyToInformation) || undefined,
						code: response.status,
						ok: (response.status >= 200 && response.status <= 299)
						|| (response.status >= 400 && response.status <= 499)
							? response.ok
							: null,
						headers: response.headers,
						type: response.type,
						url: response.url,
						redirected: response.redirected,
						raw: response,
						requestDefinition,
					})),
			)
			.catch(
				(error) => {
					throw new RequestError(error, requestDefinition);
				},
			);
	}
}
