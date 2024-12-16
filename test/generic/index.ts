import { HttpClient } from "@scripts/httpClient";
import { type Routes } from "./types";
import { type ExpectType } from "@test/utils/expectType";
import { type Response } from "@scripts/PromiseRequest";

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
