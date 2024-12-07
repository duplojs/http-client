import { getBody } from "./getBody";

describe("get body from response", () => {
	it("get json", () => {
		const response = {
			headers: {
				get: () => "json",
			},
			json: vi.fn(),
		};

		void getBody(<any>response);

		expect(response.json).toHaveBeenCalledOnce();
	});

	it("get text", () => {
		const response = {
			headers: {
				get: () => "text",
			},
			text: vi.fn(),
		};

		void getBody(<any>response);

		expect(response.text).toHaveBeenCalledOnce();
	});

	it("get form-data", () => {
		const response = {
			headers: {
				get: () => "form-data",
			},
			formData: vi.fn(),
		};

		void getBody(<any>response);

		expect(response.formData).toHaveBeenCalledOnce();
	});

	it("get blob", () => {
		const response = {
			headers: {
				get: () => "test",
			},
			blob: vi.fn(),
		};

		void getBody(<any>response);

		expect(response.blob).toHaveBeenCalledOnce();
	});

	it("get empty body", async() => {
		const response = {
			headers: {
				get: () => undefined,
			},
		};

		expect(await getBody(<any>response)).toBe(undefined);
	});
});
