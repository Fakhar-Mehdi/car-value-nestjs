import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    console.log('in guard');

    const request = context.switchToHttp().getRequest();
    return request.session.userId;
  }
}
