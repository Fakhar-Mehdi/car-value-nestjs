import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    console.log('in current user interceptor');

    const request = context.switchToHttp().getRequest();
    const token = request.headers['auth'];
    console.log('token', token);

    if (token) {
      const jwtService = new JwtService();
      const decodedToken = jwtService.decode(token);
      console.log('decodedToken1', decodedToken);
      const { userId, role } = decodedToken;
      if (userId && role) {
        console.log('decodedToken2', decodedToken);
        const user = this.userService.findOne(userId);
        if (user)
          request.CurrentUser = {
            userId,
            role,
          };
      }
    }
    return next.handle();
  }
}
