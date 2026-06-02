import { handler } from './lambda';

// The handler now bootstraps the full Nest app (Mongo + Cognito) and delegates
// to serverless-express, so the old static-router behavioural tests no longer
// apply. Exercising routes end-to-end requires a live Mongo + Cognito config and
// belongs in an e2e suite (test/), not this unit spec.
describe('Lambda handler', () => {
  it('is exported as a function', () => {
    expect(typeof handler).toBe('function');
  });
});
