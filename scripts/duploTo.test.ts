import { DuploTo } from "./duploTo";
import { PromiseRequest } from "./PromiseRequest";

vi.mock(
	"./PromiseRequest",
	() => ({
		PromiseRequest: vi.fn(),
	}),
);

describe("duploTo", () => {
	it("configuration", () => {
		const duploTo = new DuploTo({
			baseUrl: "https://localhost:3000/test",
			keyToInformation: "info",
		});

		expect(duploTo.baseUrl).toBe("https://localhost:3000/test");
		expect(duploTo.keyToInformation).toBe("info");

		expect(duploTo.interceptor.request(<any>"test")).toBe("test");
		expect(duploTo.interceptor.response(<any>"test")).toBe("test");

		const cb = (req: any) => req;
		duploTo.setInterceptor("request", cb);
		duploTo.setInterceptor("response", cb);

		expect(duploTo.interceptor.request).toBe(cb);
		expect(duploTo.interceptor.response).toBe(cb);
	});

	it("request", () => {
		const duploTo = new DuploTo({
			baseUrl: "http://localhost:3000",
		});

		duploTo.setDefaultRequestParams({
			params: {
				test: "1",
			},
			headers: {
				toto: "tatat",
			},
			mode: "cors",
			redirect: "manual",
		});

		void duploTo.request({
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
			interceptor: duploTo.interceptor,
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
		const duploTo = new DuploTo();

		void duploTo.get({ path: "/users/{userId}" });

		expect(PromiseRequest).toHaveBeenLastCalledWith({
			baseUrl: "",
			body: undefined,
			headers: {},
			hooks: new Set(),
			interceptor: duploTo.interceptor,
			keyToInformation: "information",
			method: "GET",
			params: {},
			paramsRequest: {},
			path: "/users/{userId}",
			query: {},
		});
	});

	it("POST", () => {
		const duploTo = new DuploTo();

		void duploTo.post({
			path: "/users/{userId}",
			body: "toto",
		});

		expect(PromiseRequest).toHaveBeenLastCalledWith({
			baseUrl: "",
			body: "toto",
			headers: {},
			hooks: new Set(),
			interceptor: duploTo.interceptor,
			keyToInformation: "information",
			method: "POST",
			params: {},
			paramsRequest: {},
			path: "/users/{userId}",
			query: {},
		});
	});

	it("PUT", () => {
		const duploTo = new DuploTo();

		void duploTo.put({
			path: "/users/{userId}",
			body: "toto",
		});

		expect(PromiseRequest).toHaveBeenLastCalledWith({
			baseUrl: "",
			body: "toto",
			headers: {},
			hooks: new Set(),
			interceptor: duploTo.interceptor,
			keyToInformation: "information",
			method: "PUT",
			params: {},
			paramsRequest: {},
			path: "/users/{userId}",
			query: {},
		});
	});

	it("PATCH", () => {
		const duploTo = new DuploTo();

		void duploTo.patch({
			path: "/users/{userId}",
			body: "toto",
		});

		expect(PromiseRequest).toHaveBeenLastCalledWith({
			baseUrl: "",
			body: "toto",
			headers: {},
			hooks: new Set(),
			interceptor: duploTo.interceptor,
			keyToInformation: "information",
			method: "PATCH",
			params: {},
			paramsRequest: {},
			path: "/users/{userId}",
			query: {},
		});
	});

	it("DELETE", () => {
		const duploTo = new DuploTo();

		void duploTo.delete({
			path: "/users/{userId}",
		});

		expect(PromiseRequest).toHaveBeenLastCalledWith({
			baseUrl: "",
			body: undefined,
			headers: {},
			hooks: new Set(),
			interceptor: duploTo.interceptor,
			keyToInformation: "information",
			method: "DELETE",
			params: {},
			paramsRequest: {},
			path: "/users/{userId}",
			query: {},
		});
	});
});
