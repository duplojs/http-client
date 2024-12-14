import { StrictFormData } from "./strictFormData";

it("strictFormData", () => {
	const fd = new StrictFormData({
		test: "ok",
		test1: ["15", "gtt"],
	});

	expect(fd.getAll("test"))
		.toStrictEqual(["ok"]);

	expect(fd.getAll("test1"))
		.toStrictEqual(["15", "gtt"]);
});
