import { type Response } from "./PromiseRequest";

export interface BaseHooks<
	GenericHookType extends string,
	GenericCallback extends (...args: any[]) => any,
> {
	type: GenericHookType;
	callback: GenericCallback;
}

export interface InformationHook<
	GenericResponse extends Response = Response,
> extends BaseHooks<
		"information",
		(response: GenericResponse) => void
	> {
	value: string;
}

export interface CodeHook<
	GenericResponse extends Response = Response,
> extends BaseHooks<
		"code",
		(response: GenericResponse) => void
	> {
	value: number;
}

export interface ErrorHook extends BaseHooks<
	"error",
	(error: unknown) => void
> {

}

export interface GeneralHook<
	GenericResponse extends Response = Response,
> extends BaseHooks<
		"general",
		(response: GenericResponse) => void
	> {
	value: 200 | 400 | 500;
}

export type Hook = InformationHook | CodeHook | ErrorHook | GeneralHook;

export type Hooks = Set<Hook>;

export function *getHook<
	GenericType extends Hook["type"],
>(
	hooks: Hooks,
	type: GenericType,
): Generator<
		Extract<Hook, { type: GenericType }>
	> {
	for (const hook of hooks) {
		if (hook.type === type) {
			yield <any>hook;
		}
	}
}

export function *getInformationHooks(
	hooks: Hooks,
	value: string,
) {
	for (const hook of getHook(hooks, "information")) {
		if (hook.value === value) {
			yield hook;
		}
	}
}

export function *getCodeHooks(
	hooks: Hooks,
	value: number,
) {
	for (const hook of getHook(hooks, "code")) {
		if (hook.value === value) {
			yield hook;
		}
	}
}

export function *getGeneralHooks(
	hooks: Hooks,
	value: GeneralHook["value"],
) {
	for (const hook of getHook(hooks, "general")) {
		if (hook.value === value) {
			yield hook;
		}
	}
}

export function getErrorHooks(
	hooks: Hooks,
) {
	return getHook(hooks, "error");
}
