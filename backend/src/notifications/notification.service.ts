import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPass = this.configService.get<string>('EMAIL_PASS');
    if (emailUser && emailPass && !emailPass.includes('your_')) {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('EMAIL_HOST', 'smtp.sendgrid.net'),
        port: this.configService.get<number>('EMAIL_PORT', 587),
        auth: { user: emailUser, pass: emailPass },
      });
    }
  }

  // ─── Email Methods ──────────────────────────────────────────────────────────

  async sendEmail(opts: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`Email not sent to ${opts.to} because SMTP is not configured.`);
      return;
    }
    
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM', '"TripDekho" <noreply@tripdekho.com>'),
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      });
      this.logger.log(`Email successfully sent to ${opts.to}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${opts.to}:`, err);
    }
  }

  async sendVendorWelcomeEmail(vendor: {
    name: string;
    email: string;
    password?: string;
  }): Promise<void> {
    const passwordNote = vendor.password
      ? `<p>Your temporary login password is: <strong>${vendor.password}</strong>. You will be asked to change it on first login.</p>`
      : `<p>You can now log in at <a href="${this.configService.get('CLIENT_URL')}/vendor/login">TripDekho Vendor Portal</a>.</p>`;

    await this.sendEmail({
      to: vendor.email,
      subject: 'Welcome to TripDekho Vendor Network!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Welcome to TripDekho, ${vendor.name}!</h2>
          <p>Your vendor account has been created. Here's what's next:</p>
          ${passwordNote}
          <p><strong>Next step:</strong> Complete your KYC verification to start listing trips and accepting bookings.</p>
          <a href="${this.configService.get('CLIENT_URL')}/vendor/onboarding" 
             style="background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin:16px 0;">
            Complete KYC Now
          </a>
          <p style="color:#6b7280;font-size:12px;">If you have questions, reply to this email. — Team TripDekho</p>
        </div>
      `,
    });
  }

  async sendKycSubmittedEmail(vendor: { name: string; email: string }): Promise<void> {
    await this.sendEmail({
      to: vendor.email,
      subject: 'KYC Documents Received — TripDekho',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">We've received your KYC documents, ${vendor.name}!</h2>
          <p>Our team will review your documents within 1-2 business days.</p>
          <p>We'll notify you as soon as your account is verified.</p>
          <p style="color:#6b7280;font-size:12px;">— Team TripDekho</p>
        </div>
      `,
    });
  }

  async sendKycApprovedEmail(vendor: { name: string; email: string }): Promise<void> {
    await this.sendEmail({
      to: vendor.email,
      subject: '✅ KYC Approved — You\'re Verified on TripDekho!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Congratulations, ${vendor.name}! You're now verified! 🎉</h2>
          <p>Your KYC has been approved. You can now:</p>
          <ul>
            <li>Create and publish trips</li>
            <li>Accept bookings from customers</li>
            <li>Access full vendor analytics</li>
          </ul>
          <a href="${this.configService.get('CLIENT_URL')}/vendor/trips" 
             style="background:#22c55e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin:16px 0;">
            Create Your First Trip
          </a>
          <p style="color:#6b7280;font-size:12px;">— Team TripDekho</p>
        </div>
      `,
    });
  }

  async sendKycRejectedEmail(vendor: { name: string; email: string }, reason?: string): Promise<void> {
    await this.sendEmail({
      to: vendor.email,
      subject: 'KYC Review — Action Required',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">KYC Review Update for ${vendor.name}</h2>
          <p>Unfortunately, your KYC documents could not be approved at this time.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p>Please re-upload your documents with clearer images.</p>
          <a href="${this.configService.get('CLIENT_URL')}/vendor/onboarding" 
             style="background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin:16px 0;">
            Resubmit KYC
          </a>
          <p style="color:#6b7280;font-size:12px;">— Team TripDekho</p>
        </div>
      `,
    });
  }

  // ─── WhatsApp Cloud API Methods ─────────────────────────────────────────────

  async sendWhatsApp(
    phone: string, 
    message: string, 
    templateData?: { contentSid: string; contentVariables: Record<string, string> }
  ): Promise<void> {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER', 'whatsapp:+14155238886');

    if (!accountSid || !authToken || accountSid.includes('your_')) {
      this.logger.warn(`[WHATSAPP FALLBACK] To: ${phone} | Message: ${message.substring(0, 50)}...`);
      return;
    }

    // Format 'to' number for Twilio sandbox
    let formattedTo = phone.startsWith('+') ? phone : `+91${phone}`;
    if (!formattedTo.startsWith('whatsapp:')) {
      formattedTo = `whatsapp:${formattedTo}`;
    }

    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
      
      const params = new URLSearchParams();
      params.append('To', formattedTo);
      params.append('From', fromNumber);
      
      if (templateData) {
        params.append('ContentSid', templateData.contentSid);
        params.append('ContentVariables', JSON.stringify(templateData.contentVariables));
      } else {
        params.append('Body', message);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      if (!response.ok) {
        const err = await response.text();
        this.logger.error(`Twilio WhatsApp API error for ${formattedTo}: ${err}`);
      } else {
        const data = await response.json();
        this.logger.log(`WhatsApp message sent to ${formattedTo} with Twilio SID: ${data.sid}`);
      }
    } catch (err) {
      this.logger.error(`Failed to send WhatsApp to ${formattedTo}:`, err);
    }
  }

  async sendVendorWelcomeWhatsApp(phone: string, name: string): Promise<void> {
    await this.sendWhatsApp(
      phone,
      `Hi ${name}! 👋 Welcome to TripDekho Vendor Network! Your account is ready. Complete your KYC to start listing trips: ${this.configService.get('CLIENT_URL')}/vendor/onboarding`,
    );
  }

  async sendKycApprovedWhatsApp(phone: string, name: string): Promise<void> {
    await this.sendWhatsApp(
      phone,
      `✅ Congratulations ${name}! Your TripDekho KYC has been approved. You can now create and publish trips. Login at: ${this.configService.get('CLIENT_URL')}/vendor/dashboard`,
    );
  }

  // ─── Meta Cloud API WhatsApp ──────────────────────────────────────────────

  async sendMetaWhatsApp(phone: string, message: string): Promise<void> {
    const token = this.configService.get<string>('META_WHATSAPP_TOKEN');
    const phoneId = this.configService.get<string>('META_WHATSAPP_PHONE_ID');
    
    // Normalize phone number: strip + and leading 0s, ensure country code.
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone; // default to India
    }

    if (!token || !phoneId) {
      this.logger.warn(`[META WHATSAPP FALLBACK] To: ${formattedPhone} | Message: ${message}`);
      return;
    }

    try {
      const response = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: { body: message },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        this.logger.error(`Meta WhatsApp failed for ${formattedPhone}: ${errText}`);
      } else {
        const data = await response.json();
        this.logger.log(`Meta WhatsApp message sent to ${formattedPhone}. Message ID: ${data.messages?.[0]?.id}`);
      }
    } catch (err) {
      this.logger.error(`Failed to send Meta WhatsApp to ${formattedPhone}:`, err);
    }
  }
}
