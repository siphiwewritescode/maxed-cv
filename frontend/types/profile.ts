export interface MasterProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  location: string | null
  headline: string | null
  summary: string | null
  noticePeriod: string | null
  experiences: WorkExperience[]
  skills: ProfileSkill[]
  education: EducationEntry[]
  projects: ProjectEntry[]
  certifications: CertificationEntry[]
  createdAt: string
  updatedAt: string
}

export interface WorkExperience {
  id: string
  jobTitle: string  // maps to 'position' on backend
  company: string
  location: string | null
  startDate: string
  endDate: string | null
  current: boolean
  bulletPoints: string[]
  order: number
}

export interface ProfileSkill {
  id: string
  name: string
  order: number
}

export interface EducationEntry {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string | null
  startDate: string
  endDate: string | null
  order: number
}

export interface ProjectEntry {
  id: string
  name: string
  description: string | null
  technologies: string[]
  url: string | null
  order: number
}

export interface CertificationEntry {
  id: string
  name: string
  issuer: string
  issueDate: string | null
  credentialId: string | null
  order: number
}
