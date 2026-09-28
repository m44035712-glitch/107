import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserProfile } from '@bis/shared-types';

export const CurrentUser = createParamDecorator(
  (data: keyof UserProfile | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data && user ? user[data] : user;
  }
);
