"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRefs = void 0;
const zod_to_json_1 = require("./zod-to-json");
const createComponentMap = (schemas) => {
    const map = new Map();
    for (const [key, value] of Object.entries(schemas)) {
        map.set(JSON.stringify(value), key);
    }
    return map;
};
const createComponentReplacer = (componentMapVK, schemasObject) => 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function componentReplacer(key, value) {
    if (typeof value !== 'object')
        return value;
    // Check if the parent is the schemas object, if so, return the value as is. This is where the schemas are defined.
    if (this === schemasObject)
        return value;
    const stringifiedValue = JSON.stringify(value);
    if (componentMapVK.has(stringifiedValue))
        return { $ref: `#/components/schemas/${componentMapVK.get(stringifiedValue)}` };
    if (value.nullable === true) {
        const nonNullableValue = { ...value };
        delete nonNullableValue.nullable;
        const stringifiedNonNullableValue = JSON.stringify(nonNullableValue);
        if (componentMapVK.has(stringifiedNonNullableValue))
            return {
                anyOf: [
                    { $ref: `#/components/schemas/${componentMapVK.get(stringifiedNonNullableValue)}` },
                ],
                nullable: true,
            };
    }
    return value;
};
const resolveRefs = (openapiObject, zodSchemas) => {
    const schemas = {};
    for (const key in zodSchemas) {
        schemas[key] = (0, zod_to_json_1.convertZodToJsonSchema)(zodSchemas[key]);
    }
    const document = {
        ...openapiObject,
        components: {
            ...openapiObject.components,
            schemas: {
                ...openapiObject.components?.schemas,
                ...schemas,
            },
        },
    };
    const componentMapVK = createComponentMap(schemas);
    const componentReplacer = createComponentReplacer(componentMapVK, document.components.schemas);
    // Using the componentReplacer function we deep check if the document has any schemas that are the same as the zod schemas provided
    // When a match is found replace them with a $ref.
    return JSON.parse(JSON.stringify(document, componentReplacer));
};
exports.resolveRefs = resolveRefs;
