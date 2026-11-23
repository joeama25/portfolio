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
    console.error("Database is asleep or unreachable:", error)
    // If the DB is asleep, return an empty array so the homepage doesn't crash
    return [] 
  }
}