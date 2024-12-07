export type Routes = | {
	method: "GET";
	path: "/users/{userId}";
	params: {
		userId: string;
	};
	response: | {
		code: 200;
		information: "user.get";
		body: {
			userId: string;
			name: string;
		};
		ok: true;
	} | {
		code: 404;
		information: "user.notFound";
		body: undefined;
		ok: false;
	};
} | {
	method: "POST";
	path: "/users";
	body: {
		name: string;
	};
	response: | {
		code: 201;
		information: "user.created";
		body: {
			userId: string;
			name: string;
		};
		ok: true;
	};
} | {
	method: "GET";
	path: "/users";
	response: | {
		code: 200;
		information: "users.get";
		body: {
			userId: string;
			name: string;
		}[];
		ok: true;
	};
} | {
	method: "PATCH";
	path: "/users/{userId}";
	params: {
		userId: string;
	};
	body: {
		name: string;
	};
	response: | {
		code: 200;
		information: "user.updated";
		body: {
			userId: string;
			name: string;
		};
		ok: true;
	} | {
		code: 404;
		information: "user.notFound";
		body: undefined;
		ok: false;
	};
} | {
	method: "PUT";
	path: "/users/{userId}";
	params: {
		userId: string;
	};
	body: {
		userId: string;
		name: string;
	};
	response: | {
		code: 200;
		information: "user.replaced";
		body: {
			userId: string;
			name: string;
		};
		ok: true;
	} | {
		code: 404;
		information: "user.notFound";
		body: undefined;
		ok: false;
	};
};
