'use client'

import { useState } from 'react'
import { deleteProject, saveProject, updateInquiryStatus } from '@/app/actions/admin'

type Project = { id: string; title: string; description: string; stack: string; url: string | null; image: string | null; featured: boolean }
type Inquiry = { id: string; name: string; email: string; message: string; status: string; createdAt: Date }

export function AdminDashboard({ user, projects, inquiries }: { user: string; projects: Project[]; inquiries: Inquiry[] }) {
  const [editing, setEditing] = useState<Project | null>(null)
  const [notice, setNotice] = useState('')
  const firstName = user.split(' ')[0]
  
  async function submit(formData: FormData) {
    await saveProject({
      id: editing?.id,
      title: String(formData.get('title')),
      description: String(formData.get('description')),
      stack: String(formData.get('stack')),
      url: String(formData.get('url') || ''),
      image: String(formData.get('image') || ''), 
      featured: formData.get('featured') === 'on'
    })
    setEditing(null); setNotice('Project saved.'); setTimeout(() => setNotice(''), 2400)
  }

  return <main className="admin-shell">
    <header className="admin-topbar"><a href="/" className="admin-brand">JA<span>.</span></a><div className="admin-actions"><a href="/">View portfolio</a><button onClick={async () => { await fetch('/api/auth/sign-out', { method: 'POST' }); window.location.href = '/' }}>Sign out</button></div></header>
    <section className="admin-content"><p className="eyebrow">PRIVATE WORKSPACE</p><h1>Good morning, {firstName}.</h1><p className="admin-lede">Curate your work, publish updates, and keep an eye on new inquiries.</p>
      {notice && <p className="admin-notice">{notice}</p>}
      <div className="admin-grid"><article><span>Projects</span><strong>{projects.length} published</strong><p>Your selected work, ready to curate.</p></article><article><span>Inquiries</span><strong>{inquiries.filter((item) => item.status === 'new').length} new</strong><p>Messages waiting for a reply.</p></article><article><span>Profile</span><strong>Joe Ama</strong><p>joeama25@gmail.com</p></article></div>
      <div className="admin-panels"><section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow">WORK</p><h2>{editing ? 'Edit project' : 'Projects'}</h2></div>{editing && <button className="admin-secondary" onClick={() => setEditing(null)}>Cancel</button>}</div>
        <form className="project-form" action={submit}>
          <label>Title<input name="title" defaultValue={editing?.title ?? ''} placeholder="Project name" required /></label>
          <label>Description<textarea name="description" defaultValue={editing?.description ?? ''} placeholder="What did you make?" required /></label>
          <label>Stack<input name="stack" defaultValue={editing?.stack ?? ''} placeholder="React / SQL / Flutter" required /></label>
          
          {/* Only ONE Project URL input now */}
          <label>Project URL<input name="url" type="url" defaultValue={editing?.url ?? ''} placeholder="https://" /></label>
          
          <label>Image URL<input name="image" type="url" defaultValue={editing?.image ?? ''} placeholder="https://your-image-link.com/image.jpg" /></label>
          <label className="check-label"><input name="featured" type="checkbox" defaultChecked={editing?.featured ?? false} /> Feature on homepage</label>
          <button className="admin-primary" type="submit">{editing ? 'Update project' : 'Add project'}</button>
        </form>
        <div className="admin-list">{projects.map((project) => <div className="admin-list-row" key={project.id}><div><strong>{project.title}</strong><span>{project.stack}</span></div><div className="row-actions"><button onClick={() => setEditing(project)}>Edit</button><button onClick={() => deleteProject(project.id)}>Delete</button></div></div>)}{projects.length === 0 && <p className="admin-empty">No projects yet. Add your first one above.</p>}</div>
      </section><section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow">INBOX</p><h2>Inquiries</h2></div></div><div className="inquiry-list">{inquiries.map((item) => <article className="inquiry" key={item.id}><div className="inquiry-top"><strong>{item.name}</strong><select value={item.status} onChange={(event) => updateInquiryStatus(item.id, event.target.value)}><option value="new">New</option><option value="read">Read</option><option value="archived">Archived</option></select></div><a href={`mailto:${item.email}`}>{item.email}</a><p>{item.message}</p></article>)}{inquiries.length === 0 && <p className="admin-empty">Your contact inbox is clear.</p>}</div></section></div>
    </section>
  </main>
}