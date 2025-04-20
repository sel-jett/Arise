import type { FastifyPluginAsync, FastifyPluginCallback, FastifyPluginOptions, FastifySchema, FastifySchemaCompiler, FastifyTypeProvider, RawServerBase, RawServerDefault } from 'fastify';
import type { FastifySerializerCompiler } from 'fastify/types/schema';
import type { OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import type { z } from 'zod';
type FreeformRecord = Record<string, any>;
export interface ZodTypeProvider extends FastifyTypeProvider {
    validator: this['schema'] extends z.ZodTypeAny ? z.output<this['schema']> : unknown;
    serializer: this['schema'] extends z.ZodTypeAny ? z.input<this['schema']> : unknown;
}
interface Schema extends FastifySchema {
    hide?: boolean;
}
export declare const createJsonSchemaTransform: ({ skipList }: {
    skipList: readonly string[];
}) => ({ schema, url }: {
    schema: Schema;
    url: string;
}) => {
    schema: Schema;
    url: string;
} | {
    schema: FreeformRecord;
    url: string;
};
export declare const jsonSchemaTransform: ({ schema, url }: {
    schema: Schema;
    url: string;
}) => {
    schema: Schema;
    url: string;
} | {
    schema: FreeformRecord;
    url: string;
};
export declare const createJsonSchemaTransformObject: ({ schemas }: {
    schemas: Record<string, z.ZodTypeAny>;
}) => (input: {
    swaggerObject: Partial<OpenAPIV2.Document>;
} | {
    openapiObject: Partial<OpenAPIV3.Document | OpenAPIV3_1.Document>;
}) => any;
export declare const validatorCompiler: FastifySchemaCompiler<z.ZodTypeAny>;
type ReplacerFunction = (this: any, key: string, value: any) => any;
export type ZodSerializerCompilerOptions = {
    replacer?: ReplacerFunction;
};
export declare const createSerializerCompiler: (options?: ZodSerializerCompilerOptions) => FastifySerializerCompiler<z.ZodTypeAny | {
    properties: z.ZodTypeAny;
}>;
export declare const serializerCompiler: FastifySerializerCompiler<z.ZodTypeAny | {
    properties: z.ZodTypeAny;
}>;
/**
 * FastifyPluginCallbackZod with Zod automatic type inference
 *
 * @example
 * ```typescript
 * import { FastifyPluginCallbackZod } from "fastify-type-provider-zod"
 *
 * const plugin: FastifyPluginCallbackZod = (fastify, options, done) => {
 *   done()
 * }
 * ```
 */
export type FastifyPluginCallbackZod<Options extends FastifyPluginOptions = Record<never, never>, Server extends RawServerBase = RawServerDefault> = FastifyPluginCallback<Options, Server, ZodTypeProvider>;
/**
 * FastifyPluginAsyncZod with Zod automatic type inference
 *
 * @example
 * ```typescript
 * import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
 *
 * const plugin: FastifyPluginAsyncZod = async (fastify, options) => {
 * }
 * ```
 */
export type FastifyPluginAsyncZod<Options extends FastifyPluginOptions = Record<never, never>, Server extends RawServerBase = RawServerDefault> = FastifyPluginAsync<Options, Server, ZodTypeProvider>;
export {};
