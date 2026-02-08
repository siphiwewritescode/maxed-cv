// Common skills database for autocomplete and normalization
// Based on current job market trends (2026)

export const COMMON_SKILLS = [
  // Programming Languages
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'C++',
  'Scala',

  // Frontend
  'React',
  'Vue.js',
  'Angular',
  'Next.js',
  'Svelte',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'SASS/SCSS',
  'Material-UI',
  'Bootstrap',
  'Webpack',
  'Vite',

  // Backend
  'Node.js',
  'Express.js',
  'NestJS',
  'Django',
  'Flask',
  'FastAPI',
  'Spring Boot',
  'ASP.NET Core',
  'Ruby on Rails',
  'Laravel',

  // Databases
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'SQLite',
  'SQL Server',
  'Oracle',
  'DynamoDB',
  'Cassandra',
  'Elasticsearch',

  // Cloud & DevOps
  'AWS',
  'Azure',
  'Google Cloud Platform',
  'Docker',
  'Kubernetes',
  'Terraform',
  'Ansible',
  'Jenkins',
  'GitHub Actions',
  'GitLab CI/CD',
  'CircleCI',
  'Nginx',
  'Apache',

  // Tools
  'Git',
  'Linux',
  'REST APIs',
  'GraphQL',
  'CI/CD',
  'Agile',
  'Scrum',
  'JIRA',
  'Confluence',
  'Postman',
  'Swagger',

  // AI/ML
  'Machine Learning',
  'Deep Learning',
  'TensorFlow',
  'PyTorch',
  'Natural Language Processing',
  'Computer Vision',
  'LangChain',
  'OpenAI API',

  // Data
  'Data Analysis',
  'SQL',
  'Data Visualization',
  'ETL',
  'Apache Spark',
  'Pandas',
  'NumPy',
  'Power BI',
  'Tableau',
  'Excel',

  // Security
  'Cybersecurity',
  'Penetration Testing',
  'Network Security',
  'Application Security',
  'OAuth',
  'JWT',

  // South African Specific
  'POPIA Compliance',
  'BBBEE Compliance',
  'South African Tax',
  'Labour Relations Act',

  // Mobile
  'React Native',
  'Flutter',
  'iOS Development',
  'Android Development',

  // Testing
  'Jest',
  'Cypress',
  'Playwright',
  'Selenium',
  'Unit Testing',
  'Integration Testing',
  'E2E Testing',
] as const

// Canonical mapping for common variants/abbreviations
export const SKILL_ALIASES: Record<string, string> = {
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'py': 'Python',
  'python': 'Python',
  'reactjs': 'React',
  'react.js': 'React',
  'vuejs': 'Vue.js',
  'vue': 'Vue.js',
  'nextjs': 'Next.js',
  'next': 'Next.js',
  'nodejs': 'Node.js',
  'node': 'Node.js',
  'postgresql': 'PostgreSQL',
  'postgres': 'PostgreSQL',
  'mongodb': 'MongoDB',
  'mongo': 'MongoDB',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'gcp': 'Google Cloud Platform',
  'google cloud': 'Google Cloud Platform',
  'k8s': 'Kubernetes',
  'kubernetes': 'Kubernetes',
  'ml': 'Machine Learning',
  'machine learning': 'Machine Learning',
  'ai': 'Machine Learning',
  'nlp': 'Natural Language Processing',
  'cv': 'Computer Vision',
  'sql server': 'SQL Server',
  'mssql': 'SQL Server',
  'mysql': 'MySQL',
  'sass': 'SASS/SCSS',
  'scss': 'SASS/SCSS',
  'rest': 'REST APIs',
  'restful': 'REST APIs',
  'graphql': 'GraphQL',
  'cicd': 'CI/CD',
  'ci/cd': 'CI/CD',
}

/**
 * Normalize skill input to canonical form
 * @param input - User-entered skill name
 * @returns Canonical skill name
 */
export function normalizeSkill(input: string): string {
  const trimmed = input.trim()
  const lowercase = trimmed.toLowerCase()

  // Check if we have an alias mapping
  if (SKILL_ALIASES[lowercase]) {
    return SKILL_ALIASES[lowercase]
  }

  // Return original with proper casing (trimmed)
  return trimmed
}

/**
 * Suggest skills based on partial input
 * @param input - Partial skill name from user
 * @param limit - Maximum number of suggestions (default: 5)
 * @returns Array of matching skill names
 */
export function suggestSkills(input: string, limit: number = 5): string[] {
  if (!input || input.trim().length === 0) {
    return []
  }

  const normalized = input.toLowerCase().trim()

  return COMMON_SKILLS
    .filter(skill => skill.toLowerCase().includes(normalized))
    .slice(0, limit)
}
