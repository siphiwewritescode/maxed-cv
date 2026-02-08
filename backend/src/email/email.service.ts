import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
    this.fromEmail = this.configService.get<string>('EMAIL_FROM', '"Maxed-CV" <noreply@maxedcv.com>');
  }

  async sendVerificationEmail(
    email: string,
    verificationUrl: string,
  ): Promise<void> {
    try {
      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Verify your Maxed-CV account',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #0070f3; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">Maxed-CV</h1>
              </div>
              <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                <h2 style="color: #333; margin-top: 0;">Verify your email address</h2>
                <p>Thank you for signing up with Maxed-CV! To complete your registration, please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationUrl}" style="background-color: #0070f3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Verify Email</a>
                </div>
                <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
                <p style="color: #666; font-size: 14px;">If you didn't create an account with Maxed-CV, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">This is an automated email, please do not reply.</p>
              </div>
            </body>
          </html>
        `,
      });
      this.logger.log(`Verification email sent to ${email}`, result);
    } catch (error) {
      this.logger.warn(
        `Failed to send verification email to ${email}: ${error.message}`,
      );
      // Don't throw - app should work in development without email configuration
    }
  }

  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Reset your Maxed-CV password',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #0070f3; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">Maxed-CV</h1>
              </div>
              <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                <h2 style="color: #333; margin-top: 0;">Reset your password</h2>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" style="background-color: #0070f3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Reset Password</a>
                </div>
                <p style="color: #666; font-size: 14px;">This link will expire in 60 minutes.</p>
                <p style="color: #666; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">This is an automated email, please do not reply.</p>
              </div>
            </body>
          </html>
        `,
      });
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.warn(
        `Failed to send password reset email to ${email}: ${error.message}`,
      );
      // Don't throw - app should work in development without email configuration
    }
  }

  async sendPasswordChangedEmail(email: string): Promise<void> {
    const changeTime = new Date().toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Your Maxed-CV password was changed',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #0070f3; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">Maxed-CV</h1>
              </div>
              <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                <h2 style="color: #333; margin-top: 0;">Password changed</h2>
                <p>Your Maxed-CV password was successfully changed on ${changeTime}.</p>
                <p style="color: #666; font-size: 14px;">If you didn't make this change, please contact our support team immediately.</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">This is an automated email, please do not reply.</p>
              </div>
            </body>
          </html>
        `,
      });
      this.logger.log(`Password changed notification sent to ${email}`);
    } catch (error) {
      this.logger.warn(
        `Failed to send password changed email to ${email}: ${error.message}`,
      );
      // Don't throw - app should work in development without email configuration
    }
  }

  async sendAccountDeactivatedEmail(email: string, firstName: string): Promise<void> {
    const deactivationTime = new Date().toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    try {
      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Your Maxed-CV account has been deactivated',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #0070f3; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">Maxed-CV</h1>
              </div>
              <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                <h2 style="color: #333; margin-top: 0;">Account Deactivated</h2>
                <p>Hi ${firstName},</p>
                <p>This email confirms that your Maxed-CV account has been successfully deactivated on <strong>${deactivationTime}</strong>.</p>
                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0; color: #856404;">
                    <strong>What this means:</strong>
                  </p>
                  <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #856404;">
                    <li>You can no longer log in to your account</li>
                    <li>Your profile and CV data are no longer accessible</li>
                    <li>All your sessions have been terminated</li>
                  </ul>
                </div>
                <p>If you did not request this deactivation, please contact our support team immediately at <a href="mailto:support@maxedcv.com" style="color: #0070f3;">support@maxedcv.com</a>.</p>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">We're sorry to see you go. If you have any feedback about your experience, we'd love to hear it.</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">This is an automated email, please do not reply.</p>
              </div>
            </body>
          </html>
        `,
      });
      this.logger.log(`Account deactivation confirmation sent to ${email}`, result);
    } catch (error) {
      this.logger.warn(
        `Failed to send account deactivation email to ${email}: ${error.message}`,
      );
      // Don't throw - app should work in development without email configuration
    }
  }
}
