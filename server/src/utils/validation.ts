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
  type: z.string().default('peer-reviewed'),
  title: z.string().min(3, 'Title is required'),
  author_name: z.string().optional().nullable(),
  co_authors: z.array(z.string()).optional(),
  outlet_name: z.string().optional().nullable(),
  external_url: z.string().optional().nullable().or(z.literal('')),
  published_date: z.string().optional().nullable().or(z.literal('')),
  abstract: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  status: z.string().default('published'),
});

// Project Validation Schema
export const projectSchema = z.object({
  title: z.string().min(3, 'Project title is required'),
  slug: z.string().min(3, 'Project slug is required'),
  funder_name: z.string().optional().nullable(),
  funder_code: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  objectives: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  status: z.string().default('active'),
  start_date: z.string().optional().nullable().or(z.literal('')),
  end_date: z.string().optional().nullable().or(z.literal('')),
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
  sector: z.string().min(1, 'Sector is required'),
  description: z.string().optional().nullable(),
  // external_url is required — DB schema has NOT NULL constraint
  external_url: z.string().min(1, 'Tool URL is required'),
  thumbnail: z.string().optional().nullable().or(z.literal('')),
  sort_order: z.number().int().optional().nullable(),
  is_active: z.boolean().default(true),
});
