import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    const request = context.switchToHttp().getRequest();
    const token = request.headers['auth'];
    if (token) {
      // const j = new JwtService();
      const decodedToken = this.jwtService.decode(token);
      console.log('decodedToken', decodedToken);
      request.CurrentUser = decodedToken.id;
    }

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
