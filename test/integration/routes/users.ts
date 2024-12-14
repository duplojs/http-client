import { ForbiddenHttpResponse, makeResponseContract, OkHttpResponse, useBuilder, zod, zoderce } from "@duplojs/core";

useBuilder()
	.createRoute("GET", "/users")
	.extract({
		query: {
			page: zoderce
				.number()
				.default(0),
			take: zoderce
				.number()
				.max(50)
				.default(10),
			ignoredUserId: zod
				.string()
				.toArray()
				.default(["test"]),
		},
	})
	.cut(
		({ dropper }) => dropper(null),
		[],
		makeResponseContract(ForbiddenHttpResponse, "Wrong"),
	)
	.handler(
		(pickup) => new OkHttpResponse(
			"users",
			pickup(["ignoredUserId", "page", "take"]),
		),
		makeResponseContract(
			OkHttpResponse,
			"users",
			zod.object({
				page: zod.number(),
				take: zod.number(),
				ignoredUserId: zod.string().array(),
			}),
		),
	);

useBuilder()
	.createRoute("POST", "/users")
	.extract({
		body: zod.object({
			name: zod.string(),
			age: zod.number(),
		}).strip(),
	})
	.handler(
		(pickup) => new OkHttpResponse(
			"userCreated",
			pickup("body"),
		),
		makeResponseContract(
			OkHttpResponse,
			"userCreated",
			zod.object({
				name: zod.string(),
				age: zod.number(),
			}),
		),
	);
