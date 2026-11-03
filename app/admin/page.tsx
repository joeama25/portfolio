import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getAdminContent } from '@/app/actions/admin'
import { AdminDashboard } from '@/components/admin-dashboard'

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  if (session.user.email !== 'joeama25@gmail.com') redirect('/')
  const content = await getAdminContent()
  return <AdminDashboard user={session.user.name} projects={content.projects} inquiries={content.inquiries} />
}
