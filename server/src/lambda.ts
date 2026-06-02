import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';
import { AppModule } from './app.module';

// Both production frontends (CloudFront + Amplify Hosting) and local dev.
const CORS_ORIGINS = [
  'https://dsoobg7wgy1i3.cloudfront.net',
  'https://main.dspu5eyduw64.amplifyapp.com',
  'http://localhost:5173',
  'http://localhost:3000',
];

// Bootstrapping Nest + connecting to Mongo is expensive, so we do it once and
// reuse the handler across warm invocations of the same Lambda container.
let cachedHandler: ReturnType<typeof serverlessExpress> | undefined;

async function bootstrap(): Promise<ReturnType<typeof serverlessExpress>> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: CORS_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

// Serves the entire Nest app — `api/items*` (ItemsController) and
// `users/:userId/*` (UsersController, behind the Cognito guard) — from a single
// Lambda. API Gateway must proxy these paths to this function (see notes).
export const handler = async (
  event: unknown,
  context: unknown,
  callback: unknown,
) => {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (cachedHandler as any)(event, context, callback);
};
