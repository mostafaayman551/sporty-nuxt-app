import nodemailer from 'nodemailer'

// Email transporter configuration
const createTransporter = () => {
  // Use environment variables for email configuration
  // For development, you can use Gmail or a service like Mailtrap
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  return transporter
}

export const sendEmail = async (to: string, subject: string, html: string, text?: string) => {
  try {
    // Skip email sending if SMTP is not configured (for development)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email not sent (SMTP not configured):', { to, subject })
      return { success: true, message: 'Email would be sent (SMTP not configured)' }
    }

    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"Sporty Pro" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''), // Plain text version
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error('Error sending email:', error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

export const sendConfirmationEmail = async (email: string, name: string, token: string) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  const confirmationLink = `${baseUrl}/auth/confirm-email?token=${token}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #0ea5e9); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Sporty Pro!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thank you for signing up! Please confirm your email address by clicking the button below:</p>
          <p style="text-align: center;">
            <a href="${confirmationLink}" class="button">Confirm Email Address</a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #64748b;">${confirmationLink}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Sporty Pro. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return await sendEmail(
    email,
    'Confirm Your Email Address - Sporty Pro',
    html
  )
}

export const sendPasswordResetEmail = async (email: string, name: string, token: string) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  const resetLink = `${baseUrl}/auth/reset-password?token=${token}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #0ea5e9); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 12px; }
        .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="content">
          <p>Hi ${name || 'there'},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <p style="text-align: center;">
            <a href="${resetLink}" class="button">Reset Password</a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #64748b;">${resetLink}</p>
          <div class="warning">
            <p><strong>Important:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Sporty Pro. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return await sendEmail(
    email,
    'Reset Your Password - Sporty Pro',
    html
  )
}

