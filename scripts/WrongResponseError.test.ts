import { WrongResponseError } from "./WrongResponseError";

it("WrongResponseError", () => {
	expect(new WrongResponseError({} as any)).instanceof(Error);
});
