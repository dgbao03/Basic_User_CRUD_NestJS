import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';

export const Decorators = (...args: string[]) => SetMetadata('decorators', args);

export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      
      return data ? request.user[data] : request.user;
    },
  );

export function Auth()  {
  return applyDecorators(
    UseGuards(AuthGuard)
  );
}
  