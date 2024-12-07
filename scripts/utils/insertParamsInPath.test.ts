import { insertParamsInPath } from "./insertParamsInPath";

it("insertParamsInPath", () => {
	expect(
		insertParamsInPath("/users/{userId}", {
			userId: "300",
			test: undefined,
		}),
	).toBe("/users/300");
});
