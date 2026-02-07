import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(
    email: string,
    verificationUrl: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Verify your Maxed-CV account',
        template: './verification',
        context: {
          verificationUrl,
          expiryHours: 24,
        },
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.warn(
        `Failed to send verification email to ${email}: ${error.message}`,
      );
      // Don't throw - app should work in development without email configuration
    }
  }

  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset your Maxed-CV password',
        template: './password-reset',
        context: {
          resetUrl,
          expiryMinutes: 60,
        },
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
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your Maxed-CV password was changed',
        template: './password-changed',
        context: {
          changeTime: new Date().toLocaleString('en-ZA'),
        },
      });
      this.logger.log(`Password changed notification sent to ${email}`);
    } catch (error) {
      this.logger.warn(
        `Failed to send password changed email to ${email}: ${error.message}`,
      );
      // Don't throw - app should work in development without email configuration
    }
  }
}
