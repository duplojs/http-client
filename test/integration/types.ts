import { type FindHttpClientRoute, HttpClient, StrictFormData, type TransformCodegenRouteToHttpClientRoute } from "@duplojs/http-client";
import { type CodegenRoutes } from "./OutputType";
import { type ExpectType } from "./utils/expectType";

type HttpClientRoute = TransformCodegenRouteToHttpClientRoute<
	CodegenRoutes
>;

type FirstRoute = FindHttpClientRoute<HttpClientRoute, "GET", "/users">;

type check = ExpectType<
	FirstRoute,
	{
		method: "GET";
		path: "/users";
		query?: {
			page?: string;
			take?: string;
			ignoredUserId?: string[] | string;
		} | undefined;
		response: {
			code: 403;
			information: "Wrong";
			body: undefined;
			ok: false;
		} | {
			code: 200;
			information: "users";
			body: {
				page: number;
				take: number;
				ignoredUserId: string[];
			};
			ok: true;
		};
	},
	"strict"
>;

const httpClient = new HttpClient<HttpClientRoute>();

void httpClient.get("/users")
	.whenInformation("Wrong", ({ body, code, information }) => {
		type check = ExpectType<
				typeof body,
			undefined,
			"strict"
		>;

		type check1 = ExpectType<
			typeof code,
			403,
			"strict"
		>;

		type check2 = ExpectType<
			typeof information,
			"Wrong",
			"strict"
		>;
	})
	.whenInformation("users", ({ body, code, information }) => {
		type check = ExpectType<
			typeof body,
			{
				page: number;
				take: number;
				ignoredUserId: string[];
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
			"users",
			"strict"
		>;
	});

void httpClient.post(
	"/users",
	{
		body: {
			name: "test",
			age: 12,
		},
	},
);

void httpClient.post(
	"/docs",
	{
		body: new StrictFormData({
			docs: [new File([], "toto.png")],
			accepte: "true",
			someString: "test",
		}),
	},
);

