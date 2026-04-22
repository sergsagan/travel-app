import { z } from "zod";

export const SearchSchema = z.object({
    q: z.string().min(1, "You must enter a search term"),
});

export type SearchSchema = z.infer<typeof SearchSchema>;

export const LocationFormSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(1000).nullable().optional(),
    lat: z.number().min(-90).max(90),
    long: z.number().min(-180).max(180),
});

export const LocationLogFormSchema = LocationFormSchema.extend({
    startedAt: z.number(),
    endedAt: z.number(),
}).superRefine((values, context) => {
    if (values.startedAt > values.endedAt) {
        context.addIssue({
            code: "custom",
            message: "Start date must be before end date",
            path: ["startedAt"],
        });
        context.addIssue({
            code: "custom",
            message: "End date must be after start date",
            path: ["endedAt"],
        });
    }
});

export const locationValidation = {
    name: (schema: z.ZodString) => schema.min(1).max(100),
    description: (schema: z.ZodString) => schema.max(1000),
    lat: (schema: z.ZodNumber) => schema.min(-90).max(90),
    long: (schema: z.ZodNumber) => schema.min(-180).max(180),
};
