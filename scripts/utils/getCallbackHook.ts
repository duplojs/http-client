import { type GeneralHook, type CodeHook, type InformationHook } from "@scripts/hook";
import { type Response } from "@scripts/PromiseRequest";
import { type GetResponseByStatus, type GetResponseByCode, type GetResponseByInformation } from "./getResponse";

export type GetCallbackInformationHook<
	GenericResponse extends Response,
	GenericInformation extends GenericResponse["information"],
> = InformationHook<
	GetResponseByInformation<
		GenericResponse,
		GenericInformation
	>
>["callback"];

export type GetCallbackCodeHook<
	GenericResponse extends Response,
	GenericCode extends GenericResponse["code"],
> = CodeHook<
	GetResponseByCode<
		GenericResponse,
		GenericCode
	>
>["callback"];

export type GetCallbackGeneralHook<
	GenericResponse extends Response,
	GenericStatus extends boolean,
> = GeneralHook<
	GetResponseByStatus<
		GenericResponse,
		GenericStatus
	>
>["callback"];
