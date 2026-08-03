import { z } from 'zod';

// Login Input Validation Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  totp: z.string().optional(),
});

// Media / Blog Item Validation Schema
export const mediaItemSchema = z.object({
  type: z.enum(['blog', 'documentary', 'podcast', 'talkshow', 'print']),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  body: z.string().optional(),
  excerpt: z.string().optional(),
  external_url: z.string().optional(),
  embed_url: z.string().optional(),
  cover_image: z.string().optional(),
  author_name: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).default('published'),
});

// Publication Validation Schema
export const publicationSchema = z.object({
  type: z.enum(['peer-reviewed', 'report']),
  title: z.string().min(3, 'Title is required'),
  author_name: z.string().optional(),
  co_authors: z.array(z.string()).optional(),
  outlet_name: z.string().optional(),
  external_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  published_date: z.string().optional(),
  abstract: z.string().optional(),
  thumbnail: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).default('published'),
});

// Project Validation Schema
export const projectSchema = z.object({
  title: z.string().min(3, 'Project title is required'),
  slug: z.string().min(3, 'Project slug is required'),
  funder_name: z.string().optional(),
  funder_code: z.string().optional(),
  region: z.string().optional(),
  objectives: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(['active', 'completed', 'upcoming']).default('active'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

// Team Member Validation Schema
export const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  role: z.string().optional().nullable().or(z.literal('')),
  team: z.string().optional().nullable().or(z.literal('')),
  photo: z.string().optional().nullable().or(z.literal('')),
  bio: z.string().optional().nullable().or(z.literal('')),
  social_links: z.record(z.string(), z.any()).optional().nullable(),
  sort_order: z.number().int().optional().nullable(),
  show_on_home: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

// Tool Validation Schema
export const toolSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  sector: z.enum(['Climate', 'Meteo', 'Energy', 'Water']),
  description: z.string().optional(),
  external_url: z.string().url('Invalid external URL'),
  thumbnail: z.string().optional().or(z.literal('')),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().default(true),
});
