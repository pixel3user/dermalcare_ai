import { z } from 'genkit';
import 'dotenv/config';
export declare const dermacareFlow: import("genkit").Action<z.ZodObject<{
    question: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    question: string;
    image?: string | undefined;
}, {
    question: string;
    image?: string | undefined;
}>, z.ZodObject<{
    answer: z.ZodString;
}, "strip", z.ZodTypeAny, {
    answer: string;
}, {
    answer: string;
}>, z.ZodTypeAny>;
//# sourceMappingURL=index.d.ts.map