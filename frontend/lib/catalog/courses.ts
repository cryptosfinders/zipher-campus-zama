export type CourseCatalogItem = {
  courseId: bigint
  title: string
  subtitle: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  coverGradient: string
  tags: string[]
  summary: string
}

const catalog: CourseCatalogItem[] = [
  {
    courseId: 1n,
    title: 'Encrypted Smart Contracts',
    subtitle: 'Build FH-EVM programs with Zipher Campus',
    category: 'Smart Contracts',
    difficulty: 'Beginner',
    coverGradient: 'from-amber-400 via-yellow-500 to-orange-500', // ZIPHER Brand Gradient
    tags: ['FH-EVM', 'Zama', 'Zero-Knowledge'],
    summary:
      'A beginner-friendly foundation for writing fully homomorphic smart-contracts on the FH-EVM. Learn encrypted state, privacy-preserving logic, and secure workflows.'
  },
  {
    courseId: 2n,
    title: 'Privacy-Preserving App Design',
    subtitle: 'Build secure apps on encrypted execution',
    category: 'Application Design',
    difficulty: 'Intermediate',
    coverGradient: 'from-yellow-500 via-orange-500 to-amber-500', // Warm gold/orange
    tags: ['Encryption', 'App Architecture', 'Security'],
    summary:
      'Learn to architect end-to-end encrypted experiences using Zipher Campus primitives. Includes templates for relayers, encrypted storage, and FH-EVM pipelines.'
  },
  {
    courseId: 3n,
    title: 'AI-Powered Course Studio',
    subtitle: 'Create encrypted, AI-generated learning programs',
    category: 'Production',
    difficulty: 'Intermediate',
    coverGradient: 'from-orange-500 via-amber-400 to-yellow-500', // Zipher Cinematic Gradient
    tags: ['AI', 'Automation', 'Content'],
    summary:
      'Produce high-quality training pipelines using AI content engines while keeping learner data private through encrypted FH-EVM workflows.'
  }
]

export function getCourseCatalog(): CourseCatalogItem[] {
  return catalog
}

export function findCourse(courseId: bigint): CourseCatalogItem | undefined {
  return catalog.find(course => course.courseId === courseId)
}
