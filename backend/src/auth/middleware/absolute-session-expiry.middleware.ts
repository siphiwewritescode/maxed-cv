import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AbsoluteSessionExpiryMiddleware implements NestMiddleware {
  use(req: any, res: any, next: Function) {
    if (req.session?.passport?.user && req.session?.createdAt) {
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days absolute max for all sessions

      if (Date.now() - req.session.createdAt > maxAge) {
        req.session.destroy((err: any) => {
          if (err) console.error('Session destroy error:', err);
        });
        // Don't throw -- just clear session and continue (let AuthenticatedGuard handle 401)
        return next();
      }
    }
    next();
  }
}
