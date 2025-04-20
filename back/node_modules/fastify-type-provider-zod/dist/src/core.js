"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializerCompiler = exports.createSerializerCompiler = exports.validatorCompiler = exports.createJsonSchemaTransformObject = exports.jsonSchemaTransform = exports.createJsonSchemaTransform = void 0;
const errors_1 = require("./errors");
const ref_1 = require("./ref");
const zod_to_json_1 = require("./zod-to-json");
const defaultSkipList = [
    '/documentation/',
    '/documentation/initOAuth',
    '/documentation/json',
    '/documentation/uiConfig',
    '/documentation/yaml',
    '/documentation/*',
    '/documentation/static/*',
];
const createJsonSchemaTransform = ({ skipList }) => {
    return ({ schema, url }) => {
        if (!schema) {
            return {
                schema,
                url,
            };
        }
        const { response, headers, querystring, body, params, hide, ...rest } = schema;
        const transformed = {};
        if (skipList.includes(url) || hide) {
            transformed.hide = true;
            return { schema: transformed, url };
        }
        const zodSchemas = { headers, querystring, body, params };
        for (const prop in zodSchemas) {
            const zodSchema = zodSchemas[prop];
            if (zodSchema) {
                transformed[prop] = (0, zod_to_json_1.convertZodToJsonSchema)(zodSchema);
            }
        }
        if (response) {
            transformed.response = {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for (const prop in response) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const schema = resolveSchema(response[prop]);
                const transformedResponse = (0, zod_to_json_1.convertZodToJsonSchema)(schema);
                transformed.response[prop] = transformedResponse;
            }
        }
        for (const prop in rest) {
            const meta = rest[prop];
            if (meta) {
                transformed[prop] = meta;
            }
        }
        return { schema: transformed, url };
    };
};
exports.createJsonSchemaTransform = createJsonSchemaTransform;
exports.jsonSchemaTransform = (0, exports.createJsonSchemaTransform)({
    skipList: defaultSkipList,
});
const createJsonSchemaTransformObject = ({ schemas }) => (input) => {
    if ('swaggerObject' in input) {
        console.warn('This package currently does not support component references for Swagger 2.0');
        return input.swaggerObject;
    }
    return (0, ref_1.resolveRefs)(input.openapiObject, schemas);
};
exports.createJsonSchemaTransformObject = createJsonSchemaTransformObject;
const validatorCompiler = ({ schema }) => (data) => {
    const result = schema.safeParse(data);
    if (result.error) {
        return { error: (0, errors_1.createValidationError)(result.error) };
    }
    return { value: result.data };
};
exports.validatorCompiler = validatorCompiler;
function resolveSchema(maybeSchema) {
    if ('safeParse' in maybeSchema) {
        return maybeSchema;
    }
    if ('properties' in maybeSchema) {
        return maybeSchema.properties;
    }
    throw new errors_1.InvalidSchemaError(JSON.stringify(maybeSchema));
}
const createSerializerCompiler = (options) => ({ schema: maybeSchema, method, url }) => (data) => {
    const schema = resolveSchema(maybeSchema);
    const result = schema.safeParse(data);
    if (result.error) {
        throw new errors_1.ResponseSerializationError(method, url, { cause: result.error });
    }
    return JSON.stringify(result.data, options?.replacer);
};
exports.createSerializerCompiler = createSerializerCompiler;
exports.serializerCompiler = (0, exports.createSerializerCompiler)({});
