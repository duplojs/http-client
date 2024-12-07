import { type Response } from "./PromiseRequest";

export class WrongResponseError extends Error {
	public constructor(
		public response: Response,
	) {
		super("Unexpected response.");
	}
}
