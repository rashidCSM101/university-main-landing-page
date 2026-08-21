import { z } from 'zod';

// ─────────────────────────────────────────────
// Shared Helpers
// ─────────────────────────────────────────────

/** Maximum Base64 image payload size: 4 MB (≈ 5,592,405 Base64 chars) */
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_BASE64_CHARS = Math.ceil((MAX_IMAGE_BYTES / 3) * 4);

/**
 * Zod refinement: validates that a string is either:
 *  - a valid HTTPS/HTTP URL, or
 *  - a Base64 data URI whose decoded size does not exceed MAX_IMAGE_BYTES (~4 MB)
 */
const imageField = z
  .string()
  .optional()
  .nullable()
  .refine(
    (val) => {
      if (!val || val.trim() === '') return true;
      // Allow any valid URL (http/https/relative path)
      if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/')) return true;
      // Allow Base64 data URI — but cap payload size
      if (val.startsWith('data:image/')) {
        const base64Part = val.split(',')[1] || '';
        return base64Part.length <= MAX_BASE64_CHARS;
      }
      return true; // allow other formats (blob URLs, etc.) without blocking
    },
    { message: `Image data exceeds the 4 MB limit. Please resize or compress the image before uploading.` }
  );

/** Validates an optional URL field — allows empty string, null, or valid http/https URL */
const optionalUrl = z
  .string()
  .optional()
  .nullable()
  .refine(
    (val) => {
      if (!val || val.trim() === '') return true;
      try {
        const url = new URL(val);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    },
    { message: 'Must be a valid http:// or https:// URL.' }
  )
  .or(z.literal(''));

/** Validates an optional ISO 8601 date string (YYYY-MM-DD or full ISO timestamp) */
const optionalDate = z
  .string()
  .optional()
  .nullable()
  .refine(
    (val) => {
      if (!val || val.trim() === '') return true;
      const d = new Date(val);
      return !isNaN(d.getTime());
    },
    { message: 'Must be a valid date (e.g. 2024-01-15).' }
  )
  .or(z.literal(''));

// ─────────────────────────────────────────────
// Login Input Validation Schema
// ─────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  totp: z.string().optional(),
});

// ─────────────────────────────────────────────
// Media / Blog Item Validation Schema
// ─────────────────────────────────────────────
export const mediaItemSchema = z.object({
  type: z.enum(['blog', 'documentary', 'podcast', 'talkshow', 'print']),
  title: z.string().min(1, 'Title is required').max(500, 'Title must be under 500 characters'),
  slug: z.string().min(1, 'Slug is required').max(300, 'Slug must be under 300 characters'),
  body: z.string().max(200000, 'Body content is too large (max 200,000 characters)').optional(),
  excerpt: z.string().max(2000, 'Excerpt must be under 2,000 characters').optional(),
  external_url: optionalUrl,
  embed_url: optionalUrl,
  cover_image: imageField,
  author_name: z.string().max(200, 'Author name too long').optional(),
  tags: z.array(z.string().max(50)).max(20, 'Maximum 20 tags allowed').optional(),
  status: z.enum(['draft', 'pending', 'published']).default('published'),
});

// ─────────────────────────────────────────────
// Publication Validation Schema
// ─────────────────────────────────────────────
export const publicationSchema = z.object({
  type: z.string().default('peer-reviewed'),
  title: z.string().min(3, 'Title is required').max(500, 'Title must be under 500 characters'),
  author_name: z.string().max(200, 'Author name too long').optional().nullable(),
  co_authors: z.array(z.string().max(200)).max(50, 'Maximum 50 co-authors').optional(),
  outlet_name: z.string().max(300, 'Outlet name too long').optional().nullable(),
  external_url: optionalUrl,
  published_date: optionalDate,
  abstract: z.string().max(10000, 'Abstract must be under 10,000 characters').optional().nullable(),
  thumbnail: imageField,
  tags: z.array(z.string().max(50)).max(20, 'Maximum 20 tags allowed').optional(),
  status: z.string().default('published'),
});

// ─────────────────────────────────────────────
// Project Validation Schema  (with cross-field date constraint)
// ─────────────────────────────────────────────
export const projectSchema = z
  .object({
    title: z.string().min(3, 'Project title is required').max(500, 'Title must be under 500 characters'),
    slug: z.string().min(3, 'Project slug is required').max(300, 'Slug must be under 300 characters'),
    funder_name: z.string().max(300, 'Funder name too long').optional().nullable(),
    funder_code: z.string().max(100, 'Funder code too long').optional().nullable(),
    region: z.string().max(200, 'Region too long').optional().nullable(),
    objectives: z.array(z.string().max(1000)).max(50).optional(),
    activities: z.array(z.string().max(1000)).max(50).optional(),
    services: z.array(z.string().max(1000)).max(50).optional(),
    images: z
      .array(imageField)
      .max(20, 'Maximum 20 project images allowed')
      .optional(),
    status: z.string().default('active'),
    start_date: optionalDate,
    end_date: optionalDate,
  })
  .superRefine((data, ctx) => {
    // Cross-field date constraint: end_date must be after start_date
    if (data.start_date && data.end_date) {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['end_date'],
          message: 'End date must be on or after the start date.',
        });
      }
    }
  });

// ─────────────────────────────────────────────
// Team Member Validation Schema
// ─────────────────────────────────────────────
export const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name is required').max(200, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug too long'),
  role: z.string().max(200, 'Role too long').optional().nullable().or(z.literal('')),
  team: z.string().max(200, 'Team too long').optional().nullable().or(z.literal('')),
  photo: imageField,
  bio: z.string().max(5000, 'Bio must be under 5,000 characters').optional().nullable().or(z.literal('')),
  social_links: z.record(z.string(), z.any()).optional().nullable(),
  sort_order: z.number().int().optional().nullable(),
  show_on_home: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

// ─────────────────────────────────────────────
// Tool Validation Schema
// ─────────────────────────────────────────────
export const toolSchema = z.object({
  title: z.string().min(2, 'Title is required').max(300, 'Title too long'),
  sector: z.string().min(1, 'Sector is required').max(200, 'Sector too long'),
  description: z.string().max(5000, 'Description must be under 5,000 characters').optional().nullable(),
  external_url: optionalUrl,
  thumbnail: imageField,
  sort_order: z.number().int().optional().nullable(),
  is_active: z.boolean().default(true),
});


