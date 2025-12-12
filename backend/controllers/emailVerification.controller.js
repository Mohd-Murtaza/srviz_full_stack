import EmailVerification from '../models/emailVerification.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { successResponse, errorResponse, validationErrorResponse } from '../utils/response.js';

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour expiry for token

// Send verification email
export const sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json(validationErrorResponse([{ field: 'email', message: 'Valid email is required' }]));
    }

    const normalized = email.toLowerCase().trim();

    // Check if email already exists in database
    let emailRecord = await EmailVerification.findOne({ email: normalized });

    // If exists and already verified
    if (emailRecord && emailRecord.verified && emailRecord.expiresAt >= new Date()) {
      return res.status(200).json(successResponse(null, 'Email is already verified'));
    }

    // Generate new token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

    // Update existing record or create new one
    if (emailRecord) {
      // Update existing unverified record with new token
      emailRecord.token = token;
      emailRecord.expiresAt = expiresAt;
      emailRecord.verified = false;
      await emailRecord.save();
    } else {
      // Create new record if email doesn't exist
      emailRecord = await EmailVerification.create({ 
        email: normalized, 
        token, 
        expiresAt, 
        verified: false 
      });
    }

    // Send email via nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;
    const verifyUrl = `${backendUrl}/api/verify-email/${token}`;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const mailOptions = {
      from: process.env.EMAIL_FROM || `no-reply@${new URL(frontendUrl).hostname}`,
      to: normalized,
      subject: 'Please verify your email for your request',
      html: `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email</title>
        <style>
          body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
          table { border-collapse: collapse; }
          .container { width: 100%; max-width: 680px; margin: 0 auto; }
          .card { background: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 4px 20px rgba(16,24,40,0.06); }
          .header { text-align: center; padding-bottom: 16px; }
          .logo { font-weight: 700; font-size: 20px; color: #0f172a; text-decoration: none; }
          .prehead { color: #64748b; font-size: 13px; }
          h1 { margin: 0 0 12px 0; font-size: 20px; color: #0f172a; }
          p { color: #334155; line-height: 1.5; font-size: 15px; }
          .button { display: inline-block; padding: 12px 20px; background-color: #0b74de; color: #ffffff !important; border-radius: 8px; text-decoration: none; font-weight: 600; }
          .fallback { word-break: break-all; color: #0b74de; }
          .muted { color: #94a3b8; font-size: 13px; }
          .footer { text-align: center; color: #94a3b8; font-size: 13px; padding-top: 18px; }
          @media (max-width: 600px) {
            .card { padding: 20px; }
            h1 { font-size: 18px; }
          }
        </style>
      </head>
      <body>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center" style="padding:24px 12px;">
              <div class="container">
                <div class="card">
                  <div class="header">
                    <a href="${frontendUrl}" class="logo">${new URL(frontendUrl).hostname.replace('www.', '')}</a>
                    <div class="prehead">Verify your email to continue</div>
                  </div>
                  <h1>Confirm your email address</h1>
                  <p>Hi there,</p>
                  <p>Thanks for reaching out — to complete your enquiry and make sure we can contact you, please verify that this email address belongs to you. This link will expire in 1 hour.</p>
                  <p style="text-align:center; margin: 24px 0;">
                    <a href="${verifyUrl}" class="button" target="_blank" rel="noopener">Verify Email</a>
                  </p>
                  <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
                  <p class="fallback"><a href="${verifyUrl}" target="_blank" rel="noopener">${verifyUrl}</a></p>
                  <p class="muted">If you didn't request this verification, you can safely ignore this email. Your email will not be verified.</p>
                  <div style="height:1px;background:#eef2f7;margin:20px 0;border-radius:2px"></div>
                  <p class="muted">Need help? Reply to this email or visit <a href="${frontendUrl}" style="color:#0b74de;text-decoration:none">${new URL(frontendUrl).hostname.replace('www.', '')}</a></p>
                  <div class="footer">&copy; ${new Date().getFullYear()} ${new URL(frontendUrl).hostname.replace('www.', '')}. All rights reserved.</div>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `,
      text: `Please verify your email by opening this link: ${verifyUrl}\n\nIf you didn't request this, ignore this message.`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json(successResponse(null, 'Verification email sent'));

  } catch (error) {
    console.error('Error sending verification email:', error);
    return res.status(500).json(errorResponse('Failed to send verification email', error.message));
  }
};

// Verify email token
export const verifyEmailToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).send('<h1>Invalid verification link</h1>');
    }

    const record = await EmailVerification.findOne({ token });

    if (!record) {
      return res.status(404).send('<h1>Verification link not found or already used</h1>');
    }

    if (record.expiresAt < new Date()) {
      return res.status(410).send('<h1>Verification link has expired</h1>');
    }

    // Mark as verified
    record.verified = true;
    await record.save();

    // Redirect to frontend with success params
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectTo = `${frontendUrl}/?emailVerified=true&email=${encodeURIComponent(record.email)}`;

    return res.writeHead(302, { Location: redirectTo }).end();

  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).send('<h1>Internal Server Error</h1>');
  }
};