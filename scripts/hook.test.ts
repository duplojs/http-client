import { getCodeHooks, getErrorHooks, getGeneralHooks, getHook, getInformationHooks, type Hook } from "./hook";

describe("hook", () => {
	const hooks = new Set<Hook>();
	const spy = vi.fn();

	hooks.add({
		type: "code",
		value: 200,
		callback: spy,
	});

	hooks.add({
		type: "information",
		value: "test",
		callback: spy,
	});

	hooks.add({
		type: "general",
		value: 200,
		callback: spy,
	});

	hooks.add({
		type: "error",
		callback: spy,
	});

	beforeEach(() => {
		spy.mockReset();
	});

	it("getHook", () => {
		for (const hook of getHook(hooks, "code")) {
			hook.callback(<any>undefined);
		}

		expect(spy).toHaveBeenCalledOnce();
	});

	it("getInformationHooks", () => {
		for (const hook of getInformationHooks(hooks, "test")) {
			expect(hook.type).toBe("information");
			expect(hook.value).toBe("test");

			hook.callback(<any>undefined);
		}

		expect(spy).toHaveBeenCalledOnce();
	});

	it("getCodeHooks", () => {
		for (const hook of getCodeHooks(hooks, 200)) {
			expect(hook.type).toBe("code");
			expect(hook.value).toBe(200);

			hook.callback(<any>undefined);
		}

		expect(spy).toHaveBeenCalledOnce();
	});

	it("getGeneralHooks", () => {
		for (const hook of getGeneralHooks(hooks, 200)) {
			expect(hook.type).toBe("general");
			expect(hook.value).toBe(200);

			hook.callback(<any>undefined);
		}

		expect(spy).toHaveBeenCalledOnce();
	});

	it("getErrorHooks", () => {
		for (const hook of getErrorHooks(hooks)) {
			expect(hook.type).toBe("error");

			hook.callback(<any>undefined);
		}

		expect(spy).toHaveBeenCalledOnce();
	});
});
