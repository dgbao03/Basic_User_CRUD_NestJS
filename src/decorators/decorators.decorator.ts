import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const Decorators = (...args: string[]) => SetMetadata('decorators', args);

export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      
      if (!request.user) throw new UnauthorizedException("User not found!");

      return data ? request.user[data] : request.user;
    },
  );
  