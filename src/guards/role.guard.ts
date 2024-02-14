import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class RoleGuard implements CanActivate {
  constructor(private allowRole: string) {}
  canActivate(context: ExecutionContext) {
    console.log('hello from role guard: ', this.allowRole);

    const request = context.switchToHttp().getRequest();
    const { userId, role } = request.CurrentUser || {};
    console.log(' role guard: ', this.allowRole, 'role', role);

    return userId && role === this.allowRole;
  }
}
