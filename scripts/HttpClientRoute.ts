export interface HttpClientRoute {
	method: string;
	path: string;
	headers?: Partial<Record<string, string>>;
	params?: Partial<Record<string, string | number>>;
	query?: Partial<Record<string, string | string[] | number>>;
	body?: unknown;
	response: HttpClientRouteResponse;
}

export interface HttpClientRouteResponse {
	code: number;
	information: undefined | string;
	body: unknown;
	ok: boolean;
}
