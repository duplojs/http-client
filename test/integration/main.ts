import "@duplojs/node";
import { Duplo, useRouteBuilder } from "@duplojs/core";
import "@routes/users";
import "@routes/docs";

const duplo = new Duplo({
	environment: "TEST",
	host: "localhost",
	port: 15159,
	bodySizeLimit: "1.1mb",
	recieveFormDataOptions: {
		uploadDirectory: "test/upload",
	},
});

duplo.register(...useRouteBuilder.getAllCreatedRoute());

export const server = await duplo.launch();
