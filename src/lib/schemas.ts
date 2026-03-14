import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  projectType: z.enum(
    [
      'New Fabrication',
      'Repair / Modification',
      'Design Help Needed',
      'Other',
    ],
    { errorMap: () => ({ message: 'Please select a project type' }) }
  ),
  description: z
    .string()
    .min(10, 'Please describe your project (at least 10 characters)'),
})

export type ContactFormData = z.infer<typeof contactSchema>
