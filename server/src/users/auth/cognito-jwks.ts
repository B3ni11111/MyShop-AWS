/**
 * Pre-fetched public JWKS for the Cognito user pool `us-east-1_ey3CjpMLF`.
 *
 * The users Lambda runs inside the VPC (to reach MongoDB on EC2) with no NAT,
 * so it has no outbound internet and cannot fetch this at runtime. We bundle it
 * and load it via `verifier.cacheJwks(...)` instead — see cognito-auth.guard.ts.
 *
 * If Cognito ever rotates its signing keys, re-fetch and redeploy:
 *   curl https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ey3CjpMLF/.well-known/jwks.json
 */
export const COGNITO_JWKS = {
  keys: [
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'H3/mRWHiEs4Iv47B5oSXma0nX80iyfWzUJF801WR19s=',
      kty: 'RSA',
      n: 'yySt4rSAIbhgpZVHGqyThLgxX51YvzDcknFOJIk0YGAutshhRr-uG5mnywmYSMlQzq71t-cal87GtcXzpZsROQnP2XTxpYp6MPwdj7z5wpKPe4LO1ijgmahTtI2M6iabO8oycfauSekljmcuZIFuwEWup279dtOzzETAP8G8HoSaKMCUGHjhdj4hmLHJ4-vKNMpKjStM8zb184AMZaGdzSKv4_i0BUx8Z000X8Kc_wEXC-eP6LCGIUqsp2imDuAFPefFgi-G9xG5_do4t_0k5dqlIVKbTjEAz_T4yX6uPR5YWUTYs8-Ow7vnP5ddE0rNAaHl-vzxgAZudq6SuvaZXQ',
      use: 'sig',
    },
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'LaKJvCRb65pFOoK11L7xS1Fg1dXhW20+UDFVAqNbTKk=',
      kty: 'RSA',
      n: '7jYKMxNKY6-wY34zJ79n0jV1uJIuSOGT4x60TgHhr-YXWje77JOTiGaVCmUT8o7JCnjQwZ1iMje5yVspDWyLZHKgwNwEarYb7ABMLfAex9aE1BXHUMjDrk_QQVuB3xNUT2T1DVtY_AbgCdNDcd3pXaCYtc59r0sx90VAQvxAJpLlt2h4xB4b-oOvAQfoeYS8WN4jwkp5CiuKAqRIOTLuRVO-GupdqiPA6td3ToxC4PWV2nTv5Zy48FSEr3OkKp1evCwKEAKhi3O2bkCbcPKqYVedPz2Mj_NwJFuVq3Z6q12ww9hX4Ix4gmc3uSHFm_6SgPyYqPyGWSpgnJoSOXxfYQ',
      use: 'sig',
    },
  ],
};
