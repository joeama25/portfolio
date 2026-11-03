'use server'

import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function getPublicProjects() {
  try {
    const featuredProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.featured, true))
      .orderBy(desc(projects.createdAt))
    
    return featuredProjects
  } catch (error) {
    console.error('Failed to fetch public projects:', error)
    return []
  }
}