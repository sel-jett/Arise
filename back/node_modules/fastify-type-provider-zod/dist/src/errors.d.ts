import type { FastifyError } from 'fastify';
import type { ZodError, ZodIssue, ZodIssueCode } from 'zod';
declare const ResponseSerializationError_base: import("@fastify/error").FastifyErrorConstructor<{
    code: string;
}, [{
    cause: ZodError;
}]>;
export declare class ResponseSerializationError extends ResponseSerializationError_base {
    method: string;
    url: string;
    cause: ZodError;
    constructor(method: string, url: string, options: {
        cause: ZodError;
    });
}
export declare function isResponseSerializationError(value: unknown): value is ResponseSerializationError;
export declare const InvalidSchemaError: import("@fastify/error").FastifyErrorConstructor<{
    code: string;
}, [string]>;
declare const ZodFastifySchemaValidationErrorSymbol: unique symbol;
export type ZodFastifySchemaValidationError = {
    [ZodFastifySchemaValidationErrorSymbol]: true;
    keyword: ZodIssueCode;
    instancePath: string;
    schemaPath: string;
    params: {
        issue: ZodIssue;
    };
    message: string;
};
export declare const hasZodFastifySchemaValidationErrors: (error: unknown) => error is Omit<FastifyError, "validation"> & {
    validation: ZodFastifySchemaValidationError[];
};
export declare const createValidationError: (error: ZodError) => ZodFastifySchemaValidationError[];
export {};
