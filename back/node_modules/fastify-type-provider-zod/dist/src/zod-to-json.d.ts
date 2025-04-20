import type { z } from 'zod';
export declare const convertZodToJsonSchema: (zodSchema: z.ZodTypeAny) => object & {
    $schema?: string | undefined;
    definitions?: {
        [key: string]: object;
    };
};
