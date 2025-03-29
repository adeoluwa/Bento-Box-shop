import { CreateServer } from "./core/servers/app";

CreateServer()

// Middleware
// export const AuthenticationMiddleware: Middleware = async function (ctx) {
//   if (ctx.token) throw new AuthorizationError('Not authenticated');

//   try {
//     const token = ctx.token?.replace('Bearer ', ''); // remove "Bearer prefix";
//     if (!token) throw new AuthorizationError('User not authenticated');

//     const jwtSecret = process.env.JWT_SECRET;
//     if (!jwtSecret) throw new Error('JWT_SECRET is not defined in environment variables');

//     const decodedToken = jwt.verify(token, jwtSecret);

//     if (typeof decodedToken === 'string') {
//       throw new AuthorizationError('Invalid token format');
//     }

//     ctx.user = decodedToken as JwtPayload;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   } catch (error) {
//     throw new AuthorizationError('Invalid or expired token');
//   }
// };

// Controller:
// import { createRoutingController } from '@core/interfaces/rest';
// import { User, UserService } from '@modules/user/infrastructure';
// import { AuthorizationError } from '@shared/errors';

// import { UpdateUserProfileInput } from '../inputs/user.input';

// export const userController = createRoutingController('/artist', {
//   '/update-profile': ({ controller }) => ({
//     patch: controller({
//       body: UpdateUserProfileInput,
//       middlewares: [AuthenticationMiddleware],
//       handler: async ({ body, ctx }) => {
//         const user = ctx.user as User;

//         if (!user || !user.id) throw new AuthorizationError('User not authenticated');

//         const res = await ctx.scope
//           .resolve<UserService>('userService')
//           .updateUser(user, body);

//         return { message: 'User Profile Updated Successfully', data: res };
//       },
//     }),
//   }),
// });

