import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import type { z } from 'zod';
export declare const resolveRefs: (openapiObject: Partial<OpenAPIV3.Document | OpenAPIV3_1.Document>, zodSchemas: Record<string, z.ZodTypeAny>) => any;
