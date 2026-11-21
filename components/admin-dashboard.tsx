'use client'

import { useState } from 'react'
import { deleteProject, saveProject, updateInquiryStatus } from '@/app/actions/admin'

type Project = { id: string; title: string; description: string; stack: string; url: string | null; image: string | null; image2: string | null; featured: boolean }
type Inquiry = { id: string; name: string; email: string; message: string; status: string; createdAt: Date }

export function AdminDashboard({ user, projects, inquiries }: { user: string; projects: Project[]; inquiries: Inquiry[] }) {
  const [editing, setEditing] = useState<Project | null>(null)
  const [notice, setNotice] = useState('')
  const [errorMsg, setErrorMsg] = useState('') // <-- Added error state
  const firstName = user.split(' ')[0]
  
  async function submit(formData: FormData) {
    setErrorMsg(''); // Reset error on new submit
    try {
      const file1 = formData.get('imageFile1') as File;
      const file2 = formData.get('imageFile2') as File;
      
      await saveProject({
        id: editing?.id,
        title: String(formData.get('title')),
        description: String(formData.get('description')),
        stack: String(formData.get('stack')),
        url: String(formData.get('url') || ''),
        imageFile1: file1 && file1.size > 0 ? file1 : undefined,
        imageFile2: file2 && file2.size > 0 ? file2 : undefined,
        existingImage1: editing?.image || undefined,
        existingImage2: editing?.image2 || undefined,
        featured: formData.get('featured') === 'on'
      })
      setEditing(null); 
      setNotice('Project saved.'); 
      setTimeout(() => setNotice(''), 2400)
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to save. Check if your files are under 10MB.");
    }
  }

  return <main className="admin-shell">
    <header className="admin-topbar"><a href="/" className="admin-brand">JA<span>.</span></a><div className="admin-actions"><a href="/">View portfolio</a><button onClick={async () => { await fetch('/api/auth/sign-out', { method: 'POST' }); window.location.href = '/' }}>Sign out</button></div></header>
    <section className="admin-content"><p className="eyebrow">PRIVATE WORKSPACE</p><h1>Good morning, {firstName}.</h1><p className="admin-lede">Curate your work, publish updates, and keep an eye on new inquiries.</p>
      {notice && <p className="admin-notice" style={{color: 'lime'}}>{notice}</p>}
      {errorMsg && <p className="admin-notice" style={{color: 'red', fontWeight: 'bold'}}>{errorMsg}</p>} {/* Show error */}
      
      <div className="admin-grid"><article><span>Projects</span><strong>{projects.length} published</strong><p>Your selected work, ready to curate.</p></article><article><span>Inquiries</span><strong>{inquiries.filter((item) => item.status === 'new').length} new</strong><p>Messages waiting for a reply.</p></article><article><span>Profile</span><strong>Joe Ama</strong><p>joeama25@gmail.com</p></article></div>
      
      <div className="admin-panels">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div><p className="eyebrow">WORK</p><h2>{editing ? 'Edit project' : 'Projects'}</h2></div>
            {editing && <button className="admin-secondary" onClick={() => setEditing(null)}>Cancel</button>}
          </div>
          
          <form className="flex flex-col gap-5 max-w-xl" action={submit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Title
                <input name="title" defaultValue={editing?.title ?? ''} placeholder="Project name" required className="bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-lime-400" />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                Stack
                <input name="stack" defaultValue={editing?.stack ?? ''} placeholder="React / SQL / Flutter" required className="bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-lime-400" />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm text-white/70">
              Project URL
              <input name="url" type="url" defaultValue={editing?.url ?? ''} placeholder="https://" className="bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-lime-400" />
            </label>

            <label className="flex flex-col gap-2 text-sm text-white/70">
              Description
              <textarea name="description" defaultValue={editing?.description ?? ''} placeholder="What did you make?" required rows={4} className="bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-lime-400 resize-none" />
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-white/70">Cover Image (Homepage)</span>
                <div className="relative border-2 border-dashed border-white/20 rounded-xl p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                  <input type="file" name="imageFile1" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="text-center text-sm text-white/50 group-hover:text-white/80">Click to upload cover</div>
                </div>
                {editing?.image && <span className="text-xs text-lime-400">Current image exists</span>}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-white/70">Secondary Image (Details)</span>
                <div className="relative border-2 border-dashed border-white/20 rounded-xl p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                  <input type="file" name="imageFile2" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="text-center text-sm text-white/50 group-hover:text-white/80">Click to upload secondary</div>
                </div>
                {editing?.image2 && <span className="text-xs text-lime-400">Current image exists</span>}
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-white/70 mt-2 cursor-pointer">
              <input name="featured" type="checkbox" defaultChecked={editing?.featured ?? false} className="w-4 h-4 accent-lime-400" /> 
              Feature on homepage
            </label>
            
            <button className="bg-[var(--lime)] text-black font-semibold rounded-lg p-3 mt-4 hover:opacity-90 transition-opacity" type="submit">
              {editing ? 'Update project' : 'Add project'}
            </button>
          </form>

          <div className="admin-list mt-8">
            {projects.map((project) => <div className="admin-list-row" key={project.id}><div><strong>{project.title}</strong><span>{project.stack}</span></div><div className="row-actions"><button onClick={() => setEditing(project)}>Edit</button><button onClick={() => deleteProject(project.id)}>Delete</button></div></div>)}
            {projects.length === 0 && <p className="admin-empty">No projects yet. Add your first one above.</p>}
          </div>
        </section>
        
        <section className="admin-panel">
          <div className="admin-panel-heading"><div><p className="eyebrow">INBOX</p><h2>Inquiries</h2></div></div>
          <div className="inquiry-list">
            {inquiries.map((item) => <article className="inquiry" key={item.id}><div className="inquiry-top"><strong>{item.name}</strong><select value={item.status} onChange={(event) => updateInquiryStatus(item.id, event.target.value)}><option value="new">New</option><option value="read">Read</option><option value="archived">Archived</option></select></div><a href={`mailto:${item.email}`}>{item.email}</a><p>{item.message}</p></article>)}
            {inquiries.length === 0 && <p className="admin-empty">Your contact inbox is clear.</p>}
          </div>
        </section>
      </div>
    </section>
  </main>
}