import { z } from 'zod'

export const CATEGORIES = [
  'Education',
  'Medical',
  'Disaster Relief',
  'Environment',
  'Animal Welfare',
  'Community',
  'Poverty',
  'Arts',
  'Sports',
  'Technology',
  'Other',
] as const

export const createCampaignSchema = z.object({
  title: z.string().min(5).max(150),
  description: z.string().min(20).max(1000),
  story: z.string().min(50),
  goalAmount: z.coerce.number().int().min(1000),
  category: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.enum(CATEGORIES, { errorMap: () => ({ message: 'Please select a valid category' }) })
  ),
  beneficiaryName: z.string().min(2).max(100),
  beneficiaryInfo: z.string().min(10).max(1000),
  // BUG FIX 3: The client's <input type="date"> stores the value as "YYYY-MM-DD"
  // (a date string, not ISO-8601 datetime). normalizeDeadline() on the client
  // converts it to a full ISO string before sending, so the server receives
  // something like "2025-12-31T23:59:59.999Z". The previous z.string().datetime()
  // validator is correct for that format, but it rejected strings with milliseconds
  // in some Zod versions. Using z.string().datetime({ offset: true }) makes the
  // validator accept both "Z" and "+00:00" suffixes and any millisecond precision,
  // which is what toISOString() produces.
  deadline: z
    .string()
    .datetime({ offset: true })
    .refine((d) => new Date(d) > new Date(), {
      message: 'Deadline must be in the future',
    }),
  // BUG FIX 4: images must default to [] explicitly so the Prisma create call
  // always receives an array, never undefined. The spread (`...data`) in
  // campaign.service.ts would omit the key entirely when the value is undefined,
  // which causes Prisma to throw because the String[] column is non-nullable.
  images: z.array(z.string().url()).max(5).default([]),
})

export const updateCampaignSchema = z.object({
  title: z.string().min(5).max(150).optional(),
  description: z.string().min(20).max(1000).optional(),
  story: z.string().min(50).optional(),
  goalAmount: z.coerce.number().int().min(1000).optional(),
  category: z.enum(CATEGORIES).optional(),
  beneficiaryName: z.string().min(2).max(100).optional(),
  beneficiaryInfo: z.string().min(10).max(1000).optional(),
  deadline: z
    .string()
    .datetime({ offset: true })
    .refine((d) => new Date(d) > new Date(), {
      message: 'Deadline must be in the future',
    })
    .optional(),
  images: z.array(z.string().url()).max(5).optional(),
  // ACTIVE যোগ করা হয়েছে — creator নিজে campaign activate করতে পারবে
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED']).optional(),
})

export const adminUpdateSchema = z.object({
  title: z.string().min(5).max(150).optional(),
  description: z.string().min(20).max(1000).optional(),
  story: z.string().min(50).optional(),
  goalAmount: z.coerce.number().int().min(1000).optional(),
  category: z.enum(CATEGORIES).optional(),
  beneficiaryName: z.string().min(2).max(100).optional(),
  beneficiaryInfo: z.string().min(10).max(1000).optional(),
  deadline: z.string().datetime({ offset: true }).optional(),
  images: z.array(z.string().url()).max(5).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'SUSPENDED']).optional(),
})

export const addCampaignUpdateSchema = z.object({
  title: z.string().min(3).max(150),
  content: z.string().min(10),
})

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>
export type AdminUpdateInput = z.infer<typeof adminUpdateSchema>
export type AddCampaignUpdateInput = z.infer<typeof addCampaignUpdateSchema>