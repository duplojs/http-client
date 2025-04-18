import { HttpClient } from "@scripts/httpClient";
import { type Routes } from "./types";
import { type Response } from "@scripts/PromiseRequest";
import { type ExpectType } from "@duplojs/utils";
import { type RemovePrefix } from "@scripts/index";
import { type AddPrefix } from "@scripts/utils/addPrefix";

const client = new HttpClient<Routes>();

const user = await client
	.get("/users/{userId}", { params: { userId: "test" } })
	.whenCode("200", ({ body, code, information }) => {
		type check = ExpectType<
			typeof body,
			{
				userId: string;
				name: string;
			},
			"strict"
		>;

		type check1 = ExpectType<
			typeof code,
			200,
			"strict"
		>;

		type check2 = ExpectType<
			typeof information,
			"user.get",
			"strict"
		>;
	})
	.whenInformation("user.notFound", ({ code, body, information }) => {
		type check = ExpectType<
			typeof body,
			undefined,
			"strict"
		>;

		type check1 = ExpectType<
			typeof code,
			404,
			"strict"
		>;

		type check2 = ExpectType<
			typeof information,
			"user.notFound",
			"strict"
		>;
	})
	.whenInformation(
		["user.get", "user.notFound"],
		({ code, body, information }) => {
			type check = ExpectType<
				typeof body,
				{
					userId: string;
					name: string;
				} | undefined,
				"strict"
			>;

			type check1 = ExpectType<
				typeof code,
				404 | 200,
				"strict"
			>;

			type check2 = ExpectType<
				typeof information,
				"user.notFound" | "user.get",
				"strict"
			>;
		},
	)
	.whenExpectedResponse(
		({ code, body, information }) => {
			type check = ExpectType<
				typeof body,
				{
					userId: string;
					name: string;
				} | undefined,
				"strict"
			>;

			type check1 = ExpectType<
				typeof code,
				404 | 200,
				"strict"
			>;

			type check2 = ExpectType<
				typeof information,
				"user.notFound" | "user.get",
				"strict"
			>;
		},
	)
	.iWantInformation("user.get");

type check = ExpectType<
	typeof user,
	{
		code: 200;
		information: "user.get";
		body: {
			userId: string;
			name: string;
		};
		ok: true;
		headers: Headers;
		type: ResponseType;
		url: string;
		redirected: boolean;
	},
	"strict"
>;

const notFoundUser = await client
	.put(
		"/users/{userId}",
		{
			params: { userId: "2" },
			body: {
				name: "test",
				userId: "9",
			},
		},
	)
	.whenInformation("user.replaced", ({ body, code, information }) => {
		type check = ExpectType<
			typeof body,
			{
				userId: string;
				name: string;
			},
			"strict"
		>;

		type check1 = ExpectType<
			typeof code,
			200,
			"strict"
		>;

		type check2 = ExpectType<
			typeof information,
			"user.replaced",
			"strict"
		>;
	})
	.whenCode("404", ({ code, body, information }) => {
		type check = ExpectType<
			typeof body,
			undefined,
			"strict"
		>;

		type check1 = ExpectType<
			typeof code,
			404,
			"strict"
		>;

		type check2 = ExpectType<
			typeof information,
			"user.notFound",
			"strict"
		>;
	})
	.iWantCode("404");

type check1 = ExpectType<
	typeof notFoundUser,
	{
		code: 404;
		information: "user.notFound";
		body: undefined;
		ok: false;
		headers: Headers;
		type: ResponseType;
		url: string;
		redirected: boolean;
	},
	"strict"
>;

const patcherUser = await client
	.patch(
		"/users/{userId}",
		{
			params: {
				userId: "3",
			},
			body: {
				name: "math",
			},
		},
	)
	.whenResponseSuccess(({ code, body, information }) => {
		type check = ExpectType<
			typeof body,
			{
				userId: string;
				name: string;
			},
			"strict"
		>;

		type check1 = ExpectType<
			typeof code,
			200,
			"strict"
		>;

		type check2 = ExpectType<
			typeof information,
			"user.updated",
			"strict"
		>;
	})
	.whenRequestError(({ code, body, information }) => {
		type check = ExpectType<
			typeof body,
			undefined,
			"strict"
		>;

		type check1 = ExpectType<
			typeof code,
			404,
			"strict"
		>;

		type check2 = ExpectType<
			typeof information,
			"user.notFound",
			"strict"
		>;
	})
	.iWantServerError();

type check2 = ExpectType<
	typeof patcherUser,
	Response,
	"strict"
>;

type check3 = ExpectType<
	RemovePrefix<Routes, "/us">,
	{
		method: "GET";
		path: "ers/{userId}";
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
		} | {
			code: 500;
			information: "server.error";
			body: undefined;
			ok: null;
		};
	},
	"one-extends-two"
>;

type check4 = ExpectType<
	AddPrefix<Routes, "/us">,
	{
		method: "GET";
		path: "/us/users/{userId}";
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
		} | {
			code: 500;
			information: "server.error";
			body: undefined;
			ok: null;
		};
	},
	"one-extends-two"
>;
