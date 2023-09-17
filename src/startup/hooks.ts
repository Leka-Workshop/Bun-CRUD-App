import { Elysia } from 'elysia';

export const hooksSetup = (app: Elysia) =>
  app

    // Global hook called every time the "Handled" response is sent (from endpoints below this line)
    .onResponse((handler: Elysia.Handler) => {

      // TO avoid logging when running tests
      if (process.env.NODE_ENV !== 'test') {
        console.log(`Global Handler - Method: ${handler.request.method} | URL: ${handler.request.url} | Status Code: ${handler.set.status ||= 500}`)
      }

    })

    // Global Error Hook
    .onError((handler: Elysia.Handler) => {

      // "Unhandled" response by Elysia
      if (handler.code === 'NOT_FOUND') {
        handler.set.status = 404
        return {
          message: 'Page Not Found!',
          status: 404
        };

      } else {

        // response status will be current status or 500
        handler.set.status ||= 500;

        if (handler.set.status === 400) {
          return {
            message: 'Unable to process the data!',
            status: 400
          };
        }
        return 'Service unavailable. Please come back later.'
      }
    })
