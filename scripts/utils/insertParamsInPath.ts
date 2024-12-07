import { type RequestDefinition } from "@scripts/PromiseRequest";

export function insertParamsInPath(path: string, params: RequestDefinition["params"] = {}) {
	return Object.entries(params).reduce(
		(pv, [key, value]) => {
			if (value === undefined) {
				return pv;
			}

			return pv.replace(`{${key}}`, value.toString());
		},
		path,
	);
}
