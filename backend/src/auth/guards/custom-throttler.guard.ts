import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Use user ID for authenticated requests (prevents IP-based blocking of users behind shared NAT/VPN)
    if (req.session?.passport?.user) {
      return `user:${req.session.passport.user}`;
    }
    // Fall back to IP for anonymous requests
    return req.ip;
  }
}
