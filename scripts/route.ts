export interface Route {
	method: string;
	path: string;
	headers?: Partial<Record<string, string>>;
	params?: Partial<Record<string, string | number>>;
	query?: Partial<Record<string, string | string[] | number>>;
	body?: unknown;
	response: RouteResponse;
}

export interface RouteResponse {
	code: number;
	information: undefined | string;
	body: unknown;
	ok: boolean;
}
