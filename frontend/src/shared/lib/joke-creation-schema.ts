import { z } from 'zod';

export const jokeCreationSchema = z.object({
  content: z.string().min(1).max(1000),
  externalId: z.string().optional(),
});

export type JokeCreationFormValues = z.infer<typeof jokeCreationSchema>;
