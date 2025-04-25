import { RequestError } from "./requestError";

it("reuqest error", () => {
	const requestError = new RequestError(new Error("test"), {
		method: "GET",
		path: "/test",
	} as never);

	expect(requestError.message).toBe("Faild to fecth at GET:/test.\n\nError: test");
});
