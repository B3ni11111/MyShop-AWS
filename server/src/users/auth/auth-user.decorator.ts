import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Pulls the authenticated user's email out of the verified Cognito token that
 * CognitoAuthGuard attaches to the request. The `users` collection validator
 * requires `email`, so it must be set when a user document is first created.
 */
export const AuthEmail = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return request.user?.email;
  },
);
