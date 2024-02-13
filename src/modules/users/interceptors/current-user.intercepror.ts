import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    console.log('in current user interceptor');

    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    console.log('CurrentUserInterceptor userId', userId);

    if (userId) {
      const user = await this.userService.findOne(userId);
      console.log(' CurrentUserInterceptoruser', user);

      request.CurrentUser = user;
    }
    return next.handle();
  }
}
