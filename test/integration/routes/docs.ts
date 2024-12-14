import { makeResponseContract, NoContentHttpResponse, recieveFiles, useBuilder, zod } from "@duplojs/core";

useBuilder()
	.createRoute("POST", "/docs")
	.extract({
		body: zod.receiveFormData({
			docs: recieveFiles({
				quantity: [1, 2],
				maxSize: "1mb",
				mimeType: "image/png",
			}),
			accepte: zod.booleanInString(),
			someString: zod.string(),
		}),
	})
	.handler(
		async(pickup) => {
			const { docs, accepte } = pickup("body");

			if (accepte) {
				await docs.at(0)!.deplace("test/savedFile/toto.png");
			}

			return new NoContentHttpResponse("uploadedFile");
		},
		makeResponseContract(NoContentHttpResponse, "uploadedFile"),
	);
