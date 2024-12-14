import { existsSync } from "fs";
import { lstat, mkdir, readFile, rm } from "fs/promises";
import { server } from "./main";
import { HttpClient, StrictFormData, type TransformCodegenRouteToHttpClientRoute } from "@duplojs/http-client";
import { stringToBytes } from "@duplojs/core";
import { type CodegenRoutes } from "./OutputType";

describe("integration", () => {
	beforeEach(async() => {
		for (const directory of ["test/upload", "test/savedFile"]) {
			if (existsSync(directory)) {
				await rm(directory, { recursive: true });
			}

			await mkdir(directory);
		}
	});

	afterAll(() => {
		server.close();
	});

	type HttpClientRoute = TransformCodegenRouteToHttpClientRoute<
		CodegenRoutes
	>;

	const client = new HttpClient<HttpClientRoute>({
		baseUrl: "http://localhost:15159",
	});

	it("GET /users", async() => {
		const result1 = await client
			.get("/users", { query: { ignoredUserId: "toto" } })
			.IWantInformation("users")
			.then(({ body }) => body);

		expect(result1).toStrictEqual({
			ignoredUserId: ["toto"],
			page: 0,
			take: 10,
		});

		const whenCode = vi.fn();
		const whenInformation = vi.fn();
		const whenResponseSuccess = vi.fn();

		const result2 = await client
			.get("/users", {
				query: {
					ignoredUserId: "tutu",
					page: "20",
					take: "9",
				},
			})
			.whenCode("200", whenCode)
			.whenInformation("users", whenInformation)
			.whenResponseSuccess(whenResponseSuccess)
			.IWantInformation("users")
			.then(({ body }) => body);

		expect(whenCode.mock.lastCall).toMatchObject([
			{
				code: 200,
				information: "users",
			},
		]);
		expect(whenInformation.mock.lastCall).toMatchObject([
			{
				code: 200,
				information: "users",
			},
		]);
		expect(whenResponseSuccess.mock.lastCall).toMatchObject([
			{
				code: 200,
				information: "users",
			},
		]);

		expect(result2).toStrictEqual({
			ignoredUserId: ["tutu"],
			page: 20,
			take: 9,
		});
	});

	it("POST /users", async() => {
		const result = await client
			.post(
				"/users",
				{
					body: {
						name: "liam",
						age: 16,
					},
				},
			)
			.IWantInformation("userCreated")
			.then(({ body }) => body);

		expect(result).toStrictEqual({
			name: "liam",
			age: 16,
		});
	});

	it("send file", async() => {
		const blob = new Blob([await readFile("test/fakeFiles/1mb.png", "utf-8")]);

		const formData = new StrictFormData({
			docs: [
				new File([blob], "avatar.png", {
					type: "image/png",
					lastModified: Date.now(),
				}),
			],
			accepte: "true",
			someString: "toto",
		});

		const result = await client
			.post(
				"/docs",
				{
					body: formData,
				},
			);

		expect(result.code).toBe(204);
		expect(existsSync("test/savedFile/toto.png")).toBe(true);
		expect((await lstat("test/savedFile/toto.png")).size).toBe(stringToBytes("1mb"));
	});
});
