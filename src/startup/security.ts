import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { helmet } from 'elysia-helmet';
// import { rateLimit } from 'elysia-rate-limit';

export const securitySetup = (app: Elysia) =>
  app
    .use(cors(/* Options */))
    .use(
      helmet({
        // Modify CSP to enable Swagger UI with Helmet.js
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'unpkg.com'],
            styleSrc: ["'self'", 'unpkg.com'],
            imgSrc: ['data:'],
          },
        },
      })
    )
    // .use(rateLimit({ max: 100 }));
    // Because of
    // WARN Bun.serve()'s Request object does not implement anything beyond Request object standard,
    // it is currently deemed to be impossible to use this rate limit plugin unless there're IP provided
    // by proxy server. However, you can write your own key generator via `generator` option
