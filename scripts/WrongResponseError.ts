import { type Response } from "./PromiseRequest";

export interface DetailsWrongResponseError {
	expect: string;
	receive: string;
}

export class WrongResponseError extends Error {
	public constructor(
		public response: Response,
		public details?: DetailsWrongResponseError,
	) {
		const stringDetails = details
			? `\n\tExpect : ${details.expect} \n\tReceive: ${details.receive}`
			: "";
		super(`Unexpected response. ${stringDetails}`);
	}
}
