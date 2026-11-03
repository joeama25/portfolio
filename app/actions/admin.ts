'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { inquiries, projects } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'

const ADMIN_EMAIL = 'joeama25@gmail.com'

async function getAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.email !== ADMIN_EMAIL) throw new Error('Unauthorized')
  return session.user
}

export async function getAdminContent() {
  const user = await getAdmin()
  const [projectRows, inquiryRows] = await Promise.all([
    db.select().from(projects).where(eq(projects.userId, user.id)).orderBy(desc(projects.createdAt)),
    db.select().from(inquiries).orderBy(desc(inquiries.createdAt)),
  ])
  return { projects: projectRows, inquiries: inquiryRows }
}

export async function saveProject(input: { 
  id?: string; 
  title: string; 
  description: string; 
  stack: string; 
  url?: string; 
  image?: string; // <-- Added image here
  featured: boolean 
}) {
  const user = await getAdmin()
  const title = input.title.trim()
  const description = input.description.trim()
  const stack = input.stack.trim()
  const url = input.url?.trim() || null
  const image = input.image?.trim() || null // <-- Handle image

  if (!title || !description || !stack) throw new Error('Title, description, and stack are required.')

  if (input.id) {
    await db.update(projects)
      .set({ title, description, stack, url, image, featured: input.featured, updatedAt: new Date() })
      .where(and(eq(projects.id, input.id), eq(projects.userId, user.id)))
  } else {
    await db.insert(projects)
      .values({ id: crypto.randomUUID(), userId: user.id, title, description, stack, url, image, featured: input.featured })
  }
  
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function deleteProject(id: string) {
  const user = await getAdmin()
  await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, user.id)))
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updateInquiryStatus(id: string, status: string) {
  await getAdmin()
  if (!['new', 'read', 'archived'].includes(status)) throw new Error('Invalid status')
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id))
  revalidatePath('/admin')
}