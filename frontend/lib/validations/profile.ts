import { z } from "zod"

// Personal Info Schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(100, "Last name too long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  location: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().max(500, "Summary must be 500 characters or less").optional(),
  noticePeriod: z.string().optional(),
})

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>

// Work Experience Schema
export const workExperienceSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  startDate: z.coerce.date({ required_error: "Start date is required" }),
  endDate: z.coerce.date().optional(),
  current: z.boolean().default(false),
  bulletPoints: z
    .array(z.string().min(1, "Achievement cannot be empty"))
    .min(1, "Add at least one achievement"),
}).refine((data) => {
  // If current job, end date should be empty/null
  if (data.current && data.endDate) {
    return false
  }
  // If not current and end date exists, must be after start date
  if (!data.current && data.endDate) {
    return data.endDate > data.startDate
  }
  return true
}, {
  message: "End date must be after start date",
  path: ["endDate"],
})

export type WorkExperienceFormData = z.infer<typeof workExperienceSchema>

// Education Schema
export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  startDate: z.coerce.date({ required_error: "Start date is required" }),
  endDate: z.coerce.date().optional(),
}).refine((data) => {
  // If end date exists, must be after start date
  if (data.endDate) {
    return data.endDate > data.startDate
  }
  return true
}, {
  message: "End date must be after start date",
  path: ["endDate"],
})

export type EducationFormData = z.infer<typeof educationSchema>

// Project Schema
export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().max(1000, "Description must be 1000 characters or less").optional(),
  technologies: z.array(z.string()).default([]),
  url: z.string().url("Invalid URL format").optional().or(z.literal("")),
})

export type ProjectFormData = z.infer<typeof projectSchema>

// Certification Schema
export const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.coerce.date().optional(),
  credentialId: z.string().optional(),
})

export type CertificationFormData = z.infer<typeof certificationSchema>
