import { PromiseRequest } from "./PromiseRequest";
import { getBody } from "./utils/getBody";
import { RequestError } from "./utils/requestError";
import { WrongResponseError } from "./WrongResponseError";

vi.mock(
	"./utils/getBody",
	() => ({
		getBody: vi.fn(
			() => Promise.resolve("body"),
		),
	}),
);

describe("PromiseRequest", () => {
	describe("fetch", () => {
		const spy = vi.spyOn(
			global,
			"fetch",
		);

		const response = {
			headers: {
				get: (key: string) => key,
			},
			status: 200,
			ok: true,
			type: "basic",
			url: "http://toto.fr/users/23",
			redirected: false,
		};

		spy.mockImplementation(() => Promise.resolve(<any>response));

		const requestDefinition = {
			method: "PATCH",
			path: "/users/{userId}",
			baseUrl: "http://toto.fr",
			keyToInformation: "key",
			paramsRequest: {},
			headers: {
				"my-headers": "toto",
			},
			params: {
				userId: "25",
			},
			query: {
				test: "ok",
			},
			hooks: new Set<any>(),
			interceptors: {
				request: (req: any) => req,
				response: (res: any) => res,
			},
		};

		it("fetch object body", async() => {
			const result = await PromiseRequest.fetch({
				...requestDefinition,
				body: { name: "tartenpion" },
			});

			expect(getBody).toHaveBeenLastCalledWith(response);

			expect(spy).toHaveBeenLastCalledWith(
				"http://toto.fr/users/25?test=ok",
				{
					body: "{\"name\":\"tartenpion\"}",
					headers: {
						"content-type": "application/json; charset=utf-8",
						"my-headers": "toto",
					},
					method: "PATCH",
				},
			);

			expect(result).toMatchObject({
				body: {},
				code: 200,
				information: "key",
				ok: true,
				redirected: false,
				type: "basic",
				url: "http://toto.fr/users/23",
			});
		});

		it("fetch string body", async() => {
			const result = await PromiseRequest.fetch({
				...requestDefinition,
				body: "test",
			});

			expect(getBody).toHaveBeenLastCalledWith(response);

			expect(spy).toHaveBeenLastCalledWith(
				"http://toto.fr/users/25?test=ok",
				{
					body: "test",
					headers: {
						"content-type": "text/plain; charset=utf-8",
						"my-headers": "toto",
					},
					method: "PATCH",
				},
			);

			expect(result).toMatchObject({
				body: {},
				code: 200,
				information: "key",
				ok: true,
				redirected: false,
				type: "basic",
				url: "http://toto.fr/users/23",
			});
		});

		it("fetch Error", async() => {
			spy.mockImplementation(() => Promise.reject(new Error("my Error")));

			const result = await PromiseRequest.fetch(requestDefinition)
				.catch((error) => error);

			expect(result).toEqual(
				new RequestError(new Error("my Error"), requestDefinition),
			);
		});
	});

	describe("request", () => {
		const requestDefinition = {
			method: "PATCH",
			path: "/users/{userId}",
			baseUrl: "http://toto.fr",
			keyToInformation: "key",
			paramsRequest: {},
			headers: {
				"my-headers": "toto",
			},
			params: {
				userId: "25",
			},
			query: {
				test: "ok",
			},
			hooks: new Set<any>(),
			body: undefined,
			interceptors: {
				request: vi.fn((req: any) => req),
				response: vi.fn((res: any) => res),
			},
		};

		const spy = vi.spyOn(
			PromiseRequest,
			"fetch",
		);

		it("expect code 200", async() => {
			const response = {
				body: undefined,
				code: 200,
				information: "key",
				ok: true,
				redirected: false,
				type: "basic",
				url: "http://toto.fr/users/23",
			};

			spy.mockImplementation(() => Promise.resolve(<any>response));

			const whenCode = vi.fn();
			const whenMultiCode = vi.fn();
			const whenInformation = vi.fn();
			const whenMultiInformation = vi.fn();
			const whenResponseSuccess = vi.fn();
			const whenExpectedResponse = vi.fn();

			const promise = new PromiseRequest(requestDefinition)
				.whenCode("200", whenCode)
				.whenCode(["200", "400"], whenMultiCode)
				.whenInformation("key", whenInformation)
				.whenInformation(["key", "other"], whenMultiInformation)
				.whenResponseSuccess(whenResponseSuccess)
				.whenExpectedResponse(whenExpectedResponse);

			const whenCodeError = vi.fn();
			const whenInformationError = vi.fn();
			const whenResponseSuccessError = vi.fn();
			const whenServerError = vi.fn();

			const [
				responseCode,
				responseMultiCode,
				responseInformation,
				responseMultiInformation,
				responseSuccess,
				expectedResponse,
			] = await Promise.all([
				promise.iWantCode("200"),
				promise.iWantCode(["200", "400"]),
				promise.iWantInformation("key"),
				promise.iWantInformation(["key", "other"]),
				promise.iWantResponseSuccess(),
				promise.iWantExpectedResponse(),
				promise.iWantCode("400").catch(whenCodeError),
				promise.iWantInformation("wrong").catch(whenInformationError),
				promise.iWantRequestError().catch(whenResponseSuccessError),
				promise.iWantServerError().catch(whenServerError),
			]);

			expect(whenCode).toHaveBeenLastCalledWith(response);
			expect(whenInformation).toHaveBeenLastCalledWith(response);
			expect(whenResponseSuccess).toHaveBeenLastCalledWith(response);
			expect(whenExpectedResponse).toHaveBeenLastCalledWith(response);

			expect(whenCodeError)
				.toHaveBeenLastCalledWith(new WrongResponseError(<any>response, {
					expect: "400",
					receive: "200",
				}));
			expect(whenInformationError)
				.toHaveBeenLastCalledWith(new WrongResponseError(<any>response, {
					expect: "wrong",
					receive: "key",
				}));
			expect(whenResponseSuccessError)
				.toHaveBeenLastCalledWith(new WrongResponseError(<any>response, {
					expect: "400 to 499",
					receive: "200",
				}));
			expect(whenServerError)
				.toHaveBeenLastCalledWith(new WrongResponseError(<any>response, {
					expect: "500 to 599",
					receive: "200",
				}));

			expect(responseCode).toBe(response);
			expect(responseMultiCode).toBe(response);
			expect(responseInformation).toBe(response);
			expect(responseMultiInformation).toBe(response);
			expect(responseSuccess).toBe(response);
			expect(expectedResponse).toBe(response);

			expect(requestDefinition.interceptors.request)
				.toHaveBeenCalledWith(requestDefinition);
			expect(requestDefinition.interceptors.response)
				.toHaveBeenCalledWith(response);
		});

		it("expect code 400", async() => {
			const response = {
				body: undefined,
				code: 400,
				information: "key",
				ok: false,
				redirected: false,
				type: "basic",
				url: "http://toto.fr/users/23",
			};

			spy.mockImplementation(() => Promise.resolve(<any>response));

			const whenRequestError = vi.fn();
			const whenResponseSuccess = vi.fn();
			const whenExpectedResponse = vi.fn();

			const promise = new PromiseRequest(requestDefinition)
				.whenRequestError(whenRequestError)
				.whenExpectedResponse(whenExpectedResponse);

			const [RequestError, expectedResponse] = await Promise.all([
				promise.iWantRequestError(),
				promise.iWantExpectedResponse(),
				promise.iWantResponseSuccess().catch(whenResponseSuccess),
			]);

			expect(whenRequestError).toHaveBeenLastCalledWith(response);
			expect(whenExpectedResponse).toHaveBeenLastCalledWith(response);
			expect(whenResponseSuccess)
				.toHaveBeenLastCalledWith(new WrongResponseError(<any>response, {
					expect: "200 to 299",
					receive: "400",
				}));

			expect(RequestError).toBe(response);
			expect(expectedResponse).toBe(response);
		});

		it("expect code 500", async() => {
			const response = {
				body: undefined,
				code: 500,
				information: "key",
				ok: null,
				redirected: false,
				type: "basic",
				url: "http://toto.fr/users/23",
			};

			spy.mockImplementation(() => Promise.resolve(<any>response));

			const whenServerError = vi.fn();
			const whenExpectedResponseError = vi.fn();

			const promise = new PromiseRequest(requestDefinition)
				.whenServerError(whenServerError);

			const [serverError] = await Promise.all([
				promise.iWantServerError(),
				promise.iWantExpectedResponse().catch(whenExpectedResponseError),
			]);

			expect(whenServerError).toHaveBeenLastCalledWith(response);
			expect(whenExpectedResponseError).toHaveBeenLastCalledWith(new WrongResponseError(<any>response, {
				expect: "200 to 299 or 400 to 499",
				receive: "500",
			}));

			expect(serverError).toBe(response);
		});

		it("expect error", async() => {
			const response = {
				body: undefined,
				code: 200,
				information: "key",
				ok: true,
				redirected: false,
				type: "basic",
				url: "http://toto.fr/users/23",
			};

			spy.mockImplementation(() => Promise.resolve(<any>response));

			const whenError = vi.fn();

			const promise = await new PromiseRequest(requestDefinition)
				.whenCode("200", () => {
					throw new Error();
				})
				.whenError(whenError)
				.catch(() => void undefined);

			expect(whenError).toHaveBeenLastCalledWith(new Error(), requestDefinition);
		});
	});
});
