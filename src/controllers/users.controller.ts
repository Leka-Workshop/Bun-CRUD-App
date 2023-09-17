import { Elysia, t } from 'elysia';
import User, { IUser } from '../entities/user.schema';
import { jwt } from '@elysiajs/jwt';

export const usersController = (app: Elysia) =>
  app.group('/users', (app: Elysia) =>
    app

      // Using JWT
      .use(
        jwt({
          name: 'jwt',
          secret: process.env.JWT_SECRET as string,
        })
      )

      // Validating required properties using Guard schema
      .guard({
        body: t.Object({
            username: t.String(),
            email: t.String(),
            password: t.String()
        })
      }, (app: Elysia) => app
          // This route is protected by the Guard above
          .post('/', async (handler: Elysia.Handler) => {
            try {

              const newUser = new User();
              newUser.username = handler.body.username;
              newUser.email = handler.body.email;
              newUser.password = handler.body.password;

              const savedUser = await newUser.save();

              // JWT payload is based off user id
              const accessToken = await handler.jwt.sign({
                userId: savedUser._id
              });

              // Returning JTW to the client (via headers)
              handler.set.headers = {
                'X-Authorization': accessToken,
              };
              handler.set.status = 201;

              return newUser;
            } catch (e: any) {
              // If unique mongoose constraint (for username or email) is violated
              if (e.name === 'MongoServerError' && e.code === 11000) {
                handler.set.status = 422;
                return {
                  message: 'Resource already exists!',
                  status: 422,
                };
              }

              handler.set.status = 500;
              return {
                message: 'Unable to save entry to the database!',
                status: 500,
              };
            }
          }, {
            onError(handler: Elysia.Handler) {
              console.log(`wwwwwww  Handler - Status Code: ${handler.set.status}`);
            }
          })

      )

      // Guard does not affect the following routes
      .get('/', async ({ set }: Elysia.Set) => {
        try {
          const users = await User.find({});
          return users;
        } catch (e: unknown) {
          set.status = 500;
          return {
            message: 'Unable to retrieve items from the database!',
            status: 500,
          };
        }
      })

      .get('/:id', async (handler: Elysia.Handler) => {
        try {
          const { id } = handler.params;

          const existingUser = await User.findById(id);

          if (!existingUser) {
            handler.set.status = 404;
            return {
              message: 'Requested resource was not found!',
              status: 404,
            };
          }

          return existingUser;
        } catch (e: unknown) {
          handler.set.status = 500;
          return {
            message: 'Unable to retrieve the resource!',
            status: 500,
          };
        }
      })

      .patch('/:id', async (handler: Elysia.Handler) => {
        try {
          const { id } = handler.params;

          const changes: Partial<IUser> = handler.body;

          const updatedUser = await User.findOneAndUpdate(
            { _id: id },
            { $set: { ...changes } },
            { new: true }
          );

          if (!updatedUser) {
            handler.set.status = 404;
            return {
              message: `User with id: ${id} was not found.`,
              status: 404,
            };
          }

          return updatedUser;
        } catch (e: unknown) {
          handler.set.status = 500;
          return {
            message: 'Unable to update resource!',
            status: 500,
          };
        }
      })

      .delete('/:id', async (handler: Elysia.Handler) => {
        try {
          const { id } = handler.params;

          const existingUser = await User.findById(id);

          if (!existingUser) {
            handler.set.status = 404;
            return {
              message: `User with id: ${id} was not found.`,
              status: 404,
            };
          }

          await User.findOneAndRemove({ _id: id });

          return {
            message: `Resource deleted successfully!`,
            status: 200,
          };
        } catch (e: unknown) {
          handler.set.status = 500;
          return {
            message: 'Unable to delete resource!',
            status: 500,
          };
        }
      })
  );
