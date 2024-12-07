import { type RequestDefinition } from "@scripts/PromiseRequest";

export function queryToString(query: RequestDefinition["query"]) {
	return query
		? Object.entries(query)
			.reduce<string[]>(
				(pv, [key, value]) => {
					if (!value) {
						return pv;
					}

					if (Array.isArray(value)) {
						value.forEach((subValue) => {
							pv.push(`${key}=${subValue}`);
						});
					} else {
						pv.push(`${key}=${value}`);
					}

					return pv;
				},
				[],
			)
			.join("&")
		: undefined;
}
