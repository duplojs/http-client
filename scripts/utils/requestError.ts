import { type RequestDefinition } from "@scripts/PromiseRequest";

export class RequestError extends Error {
	public constructor(
		public error: unknown,
		public requestDefinition: RequestDefinition,
	) {
		const errorMessage = error instanceof Error
			? error
			: error?.toString?.();

		super(`Faild to fecth at ${requestDefinition.method}:${requestDefinition.path}.\n\n${errorMessage}`);
	}
}
