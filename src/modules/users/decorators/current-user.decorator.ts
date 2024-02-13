import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    console.log('in decorator');

    const request = context.switchToHttp().getRequest();
    const user = request.CurrentUser;
    console.log('in decorator user', user);
    return user;
  },
);
