import { PortfolioExperience } from '@/components/portfolio-experience'
import { getPublicProjects } from '@/app/actions/projects'

export default async function Page() {
  const projects = await getPublicProjects()
  
  return <PortfolioExperience projects={projects} />
}