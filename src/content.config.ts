import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			author: z.string().default('ValdiviaSec'),
			tags: z.array(z.string()).default([]),
			category: z.string().default('general'),
		}),
});

const eventos = defineCollection({
	loader: glob({ base: './src/content/eventos', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			author: z.string().default('ValdiviaSec'),
			tags: z.array(z.string()).default([]),
			eventDate: z.coerce.date().optional(),
			location: z.string().optional(),
			eventType: z.enum(['organizado', 'asistido']).default('organizado'),
		}),
});

const noticias = defineCollection({
	loader: glob({ base: './src/content/noticias', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			author: z.string().default('ValdiviaSec'),
			tags: z.array(z.string()).default([]),
			source: z.string().optional(),
		}),
});

export const collections = { blog, eventos, noticias };