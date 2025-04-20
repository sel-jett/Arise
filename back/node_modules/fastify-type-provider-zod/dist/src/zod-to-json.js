"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertZodToJsonSchema = void 0;
const zod_to_json_schema_1 = require("zod-to-json-schema");
const zodToJsonSchemaOptions = {
    target: 'openApi3',
    $refStrategy: 'none',
};
const convertZodToJsonSchema = (zodSchema) => {
    return (0, zod_to_json_schema_1.zodToJsonSchema)(zodSchema, zodToJsonSchemaOptions);
};
exports.convertZodToJsonSchema = convertZodToJsonSchema;
