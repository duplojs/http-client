// Generated by @duplojs/types-codegen
/* eslint-disable */
/* prettier-ignore */
/* istanbul ignore file */
/* v8 ignore start */
// noinspection JSUnusedGlobalSymbols
// @ts-nocheck
interface CodegenReceiveFormData<GenericValue extends Record<string, string | string[] | number | number[] | Date | Date[] | File[]>> {
    extractor: (...args: any[]) => Promise<GenericValue>;
}

export { CodegenReceiveFormData };

type CodegenRoutes = ({
    method: "POST";
    path: "/docs";
    body: CodegenReceiveFormData<{
        docs: File[];
        accepte: "true" | "false";
        someString: string;
    }>;
    response: {
        code: 204;
        information: "uploadedFile";
        body?: undefined;
        ok: true;
    };
}) | ({
    method: "GET";
    path: "/users";
    query?: {
        page?: number | undefined;
        take?: number | undefined;
        ignoredUserId?: (string[] | string) | undefined;
    } | undefined;
    response: {
        code: 403;
        information: "Wrong";
        body?: undefined;
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
}) | ({
    method: "POST";
    path: "/users";
    body: {
        name: string;
        age: number;
    };
    response: {
        code: 200;
        information: "userCreated";
        body: {
            name: string;
            age: number;
        };
        ok: true;
    };
});

export { CodegenRoutes };
/* v8 ignore stop */
