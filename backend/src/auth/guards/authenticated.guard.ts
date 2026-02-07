import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Check if user is authenticated via Passport
    if (!request.isAuthenticated() && !request.session?.passport?.user) {
      throw new UnauthorizedException('You must be logged in');
    }

    return true;
  }
}
