import "@duplojs/node";
import { Duplo, useBuilder } from "@duplojs/core";
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

duplo.register(...useBuilder.getLastCreatedDuploses());

export const server = await duplo.launch();
