import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import type { Request } from 'express';
import { COGNITO_JWKS } from './cognito-jwks';

/**
 * Verifies the Cognito ID token sent by the frontend in the `Authorization`
 * header (raw token, no "Bearer" prefix — though both are accepted), then
 * enforces that the token's `sub` matches the `:userId` path parameter.
 *
 * This replaces the API Gateway Cognito authorizer + `validateUserAccess`
 * combination that the previous DynamoDB users-service relied on.
 */
@Injectable()
export class CognitoAuthGuard implements CanActivate {
  private readonly verifier;

  constructor() {
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    const clientId = process.env.COGNITO_CLIENT_ID;

    if (!userPoolId || !clientId) {
      throw new InternalServerErrorException(
        'COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID must be set',
      );
    }

    this.verifier = CognitoJwtVerifier.create({
      userPoolId,
      tokenUse: 'id',
      clientId,
    });

    // The Lambda runs in-VPC with no NAT, so it can't fetch the JWKS at
    // runtime. Pre-load the bundled keys so verify() never hits the network.
    this.verifier.cacheJwks(COGNITO_JWKS);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const header = request.headers.authorization;
    if (!header) {
      throw new UnauthorizedException('Missing Authorization header');
    }
    const token = header.startsWith('Bearer ') ? header.slice(7) : header;

    let payload: { sub: string };
    try {
      payload = await this.verifier.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (request as any).user = payload;

    const requestedUserId = request.params.userId;
    if (payload.sub !== requestedUserId) {
      throw new ForbiddenException('You can only access your own data');
    }

    return true;
  }
}
