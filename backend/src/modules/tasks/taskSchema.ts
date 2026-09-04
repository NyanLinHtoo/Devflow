import { z } from "zod";

const priority = ["LOW", "MEDIUM", "HIGH"] as const;

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be at most 100 characters"),

  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),

  priority: z.enum(priority).default("MEDIUM"),
  dueDate: z
    .codec(
      z.iso.datetime(), // input schema: ISO date string
      z.date(), // output schema: Date object
      {
        decode: (isoString) => new Date(isoString), // ISO string → Date
        encode: (date) => date.toISOString(), // Date → ISO string
      },
    )
    .optional(),
});
