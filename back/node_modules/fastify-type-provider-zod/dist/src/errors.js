"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidationError = exports.hasZodFastifySchemaValidationErrors = exports.InvalidSchemaError = exports.ResponseSerializationError = void 0;
exports.isResponseSerializationError = isResponseSerializationError;
const error_1 = __importDefault(require("@fastify/error"));
class ResponseSerializationError extends (0, error_1.default)('FST_ERR_RESPONSE_SERIALIZATION', "Response doesn't match the schema", 500) {
    constructor(method, url, options) {
        super({ cause: options.cause });
        this.method = method;
        this.url = url;
    }
}
exports.ResponseSerializationError = ResponseSerializationError;
function isResponseSerializationError(value) {
    return 'method' in value;
}
exports.InvalidSchemaError = (0, error_1.default)('FST_ERR_INVALID_SCHEMA', 'Invalid schema passed: %s', 500);
const ZodFastifySchemaValidationErrorSymbol = Symbol.for('ZodFastifySchemaValidationError');
const isZodFastifySchemaValidationError = (error) => typeof error === 'object' &&
    error !== null &&
    ZodFastifySchemaValidationErrorSymbol in error &&
    error[ZodFastifySchemaValidationErrorSymbol] === true;
const hasZodFastifySchemaValidationErrors = (error) => typeof error === 'object' &&
    error !== null &&
    'validation' in error &&
    Array.isArray(error.validation) &&
    error.validation.length > 0 &&
    isZodFastifySchemaValidationError(error.validation[0]);
exports.hasZodFastifySchemaValidationErrors = hasZodFastifySchemaValidationErrors;
const createValidationError = (error) => error.errors.map((issue) => ({
    [ZodFastifySchemaValidationErrorSymbol]: true,
    keyword: issue.code,
    instancePath: `/${issue.path.join('/')}`,
    schemaPath: `#/${issue.path.join('/')}/${issue.code}`,
    params: {
        issue,
    },
    message: issue.message,
}));
exports.createValidationError = createValidationError;
