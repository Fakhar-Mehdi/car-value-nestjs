import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/modules/users/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { Repository } from 'typeorm';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto, new JwtService()));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(
    private dto: any,
    private jwtService: JwtService,
  ) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    //run before request - "handler"
    //  const request = context.switchToHttp().getRequest();
    //  const token = request.headers['auth'];
    //  console.log('token', token);

    //  if (token) {
    //    const jwtService = new JwtService();
    //    const decodedToken = jwtService.decode(token);
    //    console.log('decodedToken1', decodedToken);
    //    const { userId, role } = decodedToken;
    //    if (userId && role) {
    //      console.log('decodedToken2', decodedToken);
    //      if (user)
    //        request.CurrentUser = {
    //          userId,
    //          role,
    //        };
    //  }
    //  }
    //mess around with response - "next"
    return handler.handle().pipe(
      //run something before response is sent out
      map((data: any) => {
        console.log('------------------------------------------');

        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
