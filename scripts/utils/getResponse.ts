import { type Response } from "@scripts/PromiseRequest";

export type GetResponseByInformation<
	GenericResponse extends Response,
	GenericInformation extends GenericResponse["information"],
> = [Extract<GenericResponse, { information: GenericInformation }>] extends [never]
	? Response
	: Extract<GenericResponse, { information: GenericInformation }>;

export type GetResponseByCode<
	GenericResponse extends Response,
	GenericCode extends GenericResponse["code"],
> = [Extract<GenericResponse, { code: GenericCode }>] extends [never]
	? Response
	: Extract<GenericResponse, { code: GenericCode }>;

export type GetResponseByStatus<
	GenericResponse extends Response,
	GenericStatus extends boolean,
> = [Extract<GenericResponse, { ok: GenericStatus }>] extends [never]
	? Response
	: Extract<GenericResponse, { ok: GenericStatus }>;
