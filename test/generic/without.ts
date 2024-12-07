import { HttpClient, type Request } from "@scripts/httpClient";
import { type ExpectType } from "@test/utils/expectType";
import { type Response } from "@scripts/PromiseRequest";
import { type Route } from "@scripts/route";
import { type GetRouteByMethod } from "@scripts/index";

const client = new HttpClient();

const user = await client
	.get({ path: "/users/{userId}" })
	.whenCode("200", ({ body, code, information }) => {
		type check = ExpectType<
			typeof body,
			unknown,
			"strict"
		>;

		type check1 = ExpectType<
			typeof code,
			number,
			"strict"
		>;

		type check2 = ExpectType<
			typeof information,
			string | undefined,
			"strict"
		>;
	})
	.whenInformation("user.notFound", ({ code, body, information }) => {
		type check = ExpectType<
			typeof body,
			unknown,
			"strict"
		>;

		type check1 = ExpectType<
			typeof code,
			number,
			"strict"
		>;

		type check2 = ExpectType<
			typeof information,
			string | undefined,
			"strict"
		>;
	})
	.IWantInformation("user.get");

type check = ExpectType<
	typeof user,
	Response,
	"strict"
>;

const notFoundUser = await client
	.put({
		path: "/users/{userId}",
		params: { userId: "2" },
		body: {
			name: "test",
			userId: "9",
		},
	})
	.whenInformation("user.replaced", ({ body, code, information }) => {
		type check = ExpectType<
			typeof body,
			unknown,
			"strict"
		>;

		type check1 = ExpectType<
			typeof code,
			number,
			"strict"
		>;

		type check2 = ExpectType<
			typeof information,
			string | undefined,
			"strict"
		>;
	})
	.whenCode("404", ({ code, body, information }) => {
		type check = ExpectType<
			typeof body,
			unknown,
			"strict"
		>;

		type check1 = ExpectType<
			typeof code,
			number,
			"strict"
		>;

		type check2 = ExpectType<
			typeof information,
			string | undefined,
			"strict"
		>;
	})
	.IWantCode("404");

type check1 = ExpectType<
	typeof notFoundUser,
	Response,
	"strict"
>;

const patcherUser = await client
	.patch({
		path: "/users/{userId}",
		params: {
			userId: "3",
		},
		body: {
			name: "math",
		},
	})
	.whenResponseSuccess(({ code, body, information }) => {
		type check = ExpectType<
			typeof body,
			unknown,
			"strict"
		>;

		type check1 = ExpectType<
			typeof code,
			number,
			"strict"
		>;

		type check2 = ExpectType<
			typeof information,
			string | undefined,
			"strict"
		>;
	})
	.whenRequestError(({ code, body, information }) => {
		type check = ExpectType<
			typeof body,
			unknown,
			"strict"
		>;

		type check1 = ExpectType<
			typeof code,
			number,
			"strict"
		>;

		type check2 = ExpectType<
			typeof information,
			string | undefined,
			"strict"
		>;
	})
	.IWantServerError();

type check2 = ExpectType<
	typeof patcherUser,
	Response,
	"strict"
>;

type check3 = ExpectType<
	Parameters<typeof client.get>,
	[
		Omit<
			Request<GetRouteByMethod<Route, "GET">>,
			"method" | "body"
		>,
	],
	"strict"
>;
