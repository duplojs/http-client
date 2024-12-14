import { HttpClient } from "./httpClient";
import { PromiseRequest } from "./PromiseRequest";

vi.mock(
	"./PromiseRequest",
	() => ({
		PromiseRequest: vi.fn(),
	}),
);

describe("httpClient", () => {
	it("configuration", () => {
		const client = new HttpClient({
			baseUrl: "https://localhost:3000/test",
			keyToInformation: "info",
		});

		expect(client.baseUrl).toBe("https://localhost:3000/test");
		expect(client.keyToInformation).toBe("info");

		expect(client.interceptor.request(<any>"test")).toBe("test");
		expect(client.interceptor.response(<any>"test")).toBe("test");

		const cb = (req: any) => req;
		client.setInterceptor("request", cb);
		client.setInterceptor("response", cb);

		expect(client.interceptor.request).toBe(cb);
		expect(client.interceptor.response).toBe(cb);
	});

	it("request", () => {
		const client = new HttpClient({
			baseUrl: "http://localhost:3000",
		});

		client.setDefaultRequestParams({
			params: {
				test: "1",
			},
			headers: {
				toto: "tatat",
			},
			mode: "cors",
			redirect: "manual",
		});

		void client.request({
			method: "GET",
			path: "/users/{userId}",
		});

		expect(PromiseRequest).toHaveBeenLastCalledWith({
			method: "GET",
			baseUrl: "http://localhost:3000",
			body: undefined,
			headers: {
				toto: "tatat",
			},
			hooks: new Set(),
			interceptor: client.interceptor,
			keyToInformation: "information",
			mode: "cors",
			params: {
				test: "1",
			},
			paramsRequest: {
				mode: "cors",
				redirect: "manual",
			},
			path: "/users/{userId}",
			query: {},
			redirect: "manual",
		});
	});

	it("GET", () => {
		const client = new HttpClient();

		void client.get("/users/{userId}");

		expect(PromiseRequest).toHaveBeenLastCalledWith({
			baseUrl: "",
			body: undefined,
			headers: {},
			hooks: new Set(),
			interceptor: client.interceptor,
			keyToInformation: "information",
			method: "GET",
			params: {},
			paramsRequest: {},
			path: "/users/{userId}",
			query: {},
		});
	});

	it("POST", () => {
		const client = new HttpClient();

		void client.post(
			"/users/{userId}",
			{
				body: "toto",
			},
		);

		expect(PromiseRequest).toHaveBeenLastCalledWith({
			baseUrl: "",
			body: "toto",
			headers: {},
			hooks: new Set(),
			interceptor: client.interceptor,
			keyToInformation: "information",
			method: "POST",
			params: {},
			paramsRequest: {},
			path: "/users/{userId}",
			query: {},
		});
	});

	it("PUT", () => {
		const client = new HttpClient();

		void client.put(
			"/users/{userId}",
			{
				body: "toto",
			},
		);

		expect(PromiseRequest).toHaveBeenLastCalledWith({
			baseUrl: "",
			body: "toto",
			headers: {},
			hooks: new Set(),
			interceptor: client.interceptor,
			keyToInformation: "information",
			method: "PUT",
			params: {},
			paramsRequest: {},
			path: "/users/{userId}",
			query: {},
		});
	});

	it("PATCH", () => {
		const client = new HttpClient();

		void client.patch(
			"/users/{userId}",
			{
				body: "toto",
			},
		);

		expect(PromiseRequest).toHaveBeenLastCalledWith({
			baseUrl: "",
			body: "toto",
			headers: {},
			hooks: new Set(),
			interceptor: client.interceptor,
			keyToInformation: "information",
			method: "PATCH",
			params: {},
			paramsRequest: {},
			path: "/users/{userId}",
			query: {},
		});
	});

	it("DELETE", () => {
		const client = new HttpClient();

		void client.delete("/users/{userId}");

		expect(PromiseRequest).toHaveBeenLastCalledWith({
			baseUrl: "",
			body: undefined,
			headers: {},
			hooks: new Set(),
			interceptor: client.interceptor,
			keyToInformation: "information",
			method: "DELETE",
			params: {},
			paramsRequest: {},
			path: "/users/{userId}",
			query: {},
		});
	});
});
