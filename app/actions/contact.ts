'use server'

import { db } from '@/lib/db'
import { inquiries } from '@/lib/db/schema'
import { Resend } from 'resend'

export async function submitInquiry(formData: FormData) {
  try {
    const name = String(formData.get('name'))
    const email = String(formData.get('email'))
    const message = String(formData.get('message'))

    if (!name || !email || !message) {
      return { error: 'All fields are required.' }
    }

    // 1. Save to Database (The Backup)
    await db.insert(inquiries).values({
      id: crypto.randomUUID(),
      name,
      email,
      message,
      status: 'new',
      createdAt: new Date()
    })

    // 2. Send Email Notification
    try {
      const resendApiKey = process.env.RESEND_API_KEY
      
      if (!resendApiKey) {
        console.warn('RESEND_API_KEY is missing. Skipping email.')
      } else {
        const resend = new Resend(resendApiKey)
        await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>', 
          to: 'joeama25@gmail.com', 
          subject: `New Inquiry from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
              <h2 style="color: #111315;">New Project Inquiry</h2>
              <p style="color: #666;">You received a new message from your portfolio contact form.</p>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p style="margin: 0;"><strong>Message:</strong></p>
                <p style="white-space: pre-wrap; margin-top: 5px; color: #333;">${message}</p>
              </div>

              <p style="color: #999; font-size: 12px; text-align: center;">
                Sent from your portfolio website.
              </p>
            </div>
          `
        })
        console.log('Email sent successfully')
      }
    } catch (emailError) {
      // If Resend fails, we log it but still return success because the DB worked!
      console.error('Resend failed:', emailError)
    }

    // Simulate a slight delay so the user sees the progress bar
    await new Promise(resolve => setTimeout(resolve, 800))

    return { success: true }
  } catch (error) {
    console.error('Database Error:', error)
    return { error: 'Something went wrong. Please try again later.' }
  }
}