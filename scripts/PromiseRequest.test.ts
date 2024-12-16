import { PromiseRequest } from "./PromiseRequest";
import { getBody } from "./utils/getBody";
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
			interceptor: {
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
			interceptor: {
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
			const whenInformation = vi.fn();
			const whenResponseSuccess = vi.fn();

			const promise = new PromiseRequest(requestDefinition)
				.whenCode("200", whenCode)
				.whenInformation("key", whenInformation)
				.whenResponseSuccess(whenResponseSuccess);

			const whenCodeError = vi.fn();
			const whenInformationError = vi.fn();
			const whenResponseSuccessError = vi.fn();
			const whenServerError = vi.fn();

			const [
				responseCode,
				responseInformation,
				responseSuccess,
			] = await Promise.all([
				promise.iWantCode("200"),
				promise.iWantInformation("key"),
				promise.iWantResponseSuccess(),
				promise.iWantCode("400").catch(whenCodeError),
				promise.iWantInformation("wrong").catch(whenInformationError),
				promise.iWantRequestError().catch(whenResponseSuccessError),
				promise.iWantServerError().catch(whenServerError),
			]);

			expect(whenCode).toHaveBeenLastCalledWith(response);
			expect(whenInformation).toHaveBeenLastCalledWith(response);
			expect(whenResponseSuccess).toHaveBeenLastCalledWith(response);

			expect(whenCodeError)
				.toHaveBeenLastCalledWith(new WrongResponseError(<any>response));
			expect(whenInformationError)
				.toHaveBeenLastCalledWith(new WrongResponseError(<any>response));
			expect(whenResponseSuccessError)
				.toHaveBeenLastCalledWith(new WrongResponseError(<any>response));
			expect(whenServerError)
				.toHaveBeenLastCalledWith(new WrongResponseError(<any>response));

			expect(responseCode).toBe(response);
			expect(responseInformation).toBe(response);
			expect(responseSuccess).toBe(response);

			expect(requestDefinition.interceptor.request)
				.toHaveBeenCalledWith(requestDefinition);
			expect(requestDefinition.interceptor.response)
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

			const promise = new PromiseRequest(requestDefinition)
				.whenRequestError(whenRequestError);

			const [RequestError, ResponseSuccess] = await Promise.all([
				promise.iWantRequestError(),
				promise.iWantResponseSuccess().catch(whenResponseSuccess),

			]);

			expect(whenRequestError).toHaveBeenLastCalledWith(response);
			expect(whenResponseSuccess)
				.toHaveBeenLastCalledWith(new WrongResponseError(<any>response));

			expect(RequestError).toBe(response);
		});

		it("expect code 500", async() => {
			const response = {
				body: undefined,
				code: 500,
				information: "key",
				ok: false,
				redirected: false,
				type: "basic",
				url: "http://toto.fr/users/23",
			};

			spy.mockImplementation(() => Promise.resolve(<any>response));

			const whenServerError = vi.fn();

			const promise = new PromiseRequest(requestDefinition)
				.whenServerError(whenServerError);

			const serverError = await promise.iWantServerError();

			expect(whenServerError).toHaveBeenLastCalledWith(response);

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

			expect(whenError).toHaveBeenLastCalledWith(new Error());
		});
	});
});
