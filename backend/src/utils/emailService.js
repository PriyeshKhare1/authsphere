import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Lazy-load transporter so env vars are available when needed
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('❌ EMAIL_USER or EMAIL_PASSWORD is missing in .env file!');
      throw new Error('Email credentials not configured');
    }
    
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    console.log('✅ Email transporter initialized with:', process.env.EMAIL_USER);
  }
  return transporter;
};

// Generate verification token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
export const sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
  
  const mailOptions = {
    from: `"AuthSphere" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: '✅ Verify Your Email - AuthSphere',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Welcome to AuthSphere! 🎉</h1>
          </div>
          <div class="content">
            <h2>Hi ${user.name},</h2>
            <p>Thank you for registering with AuthSphere. We're excited to have you on board!</p>
            
            <p>To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="background: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 13px;">
              ${verificationUrl}
            </p>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> This verification link will expire in 24 hours.
            </div>
            
            <p>If you didn't create an account with AuthSphere, please ignore this email.</p>
            
            <p>Best regards,<br><strong>The AuthSphere Team</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} AuthSphere. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const emailTransporter = getTransporter();
    await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${user.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: `"AuthSphere" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: '🎉 Welcome to AuthSphere!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Email Verified Successfully! ✅</h1>
          </div>
          <div class="content">
            <h2>Hi ${user.name},</h2>
            <p>Your email has been successfully verified! Your account is now active and ready to use.</p>
            
            <p>You can now log in to your account and start using all features of AuthSphere.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/auth" class="button">Go to Login</a>
            </div>
            
            <p>Thank you for joining AuthSphere!</p>
            
            <p>Best regards,<br><strong>The AuthSphere Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const emailTransporter = getTransporter();
    await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
  }
};
