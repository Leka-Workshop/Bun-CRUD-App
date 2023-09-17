import { Elysia } from 'elysia';
import { html } from '@elysiajs/html'

export const staticDataController = (app: Elysia) =>
  app
    .use(html()) // prerequisite to return HTML or JSX
    .get('/html', () => {
      return (
        `<html lang="en">
          <head>
            <title>Elysia HTML Page</title>
          </head>
          <body>
            <h1>Hello World!</h1>
          </body>
      </html>`
      )
    })
    .get('/error/test', () => {
      throw new Error('Something went wrong');
    },
    // Local hooks
    {
      beforeHandle(handler: Elysia.Handler) {
        console.log(`Before Handler - Status Code: ${handler.set.status}`);
      }
  }
    )
