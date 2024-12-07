import { queryToString } from "./queryToString";

it("queryToString", () => {
	expect(
		queryToString({
			test1: 3,
			test2: undefined,
			test3: ["toto", "tata"],
		}),
	).toBe("test1=3&test3=toto&test3=tata");
});
