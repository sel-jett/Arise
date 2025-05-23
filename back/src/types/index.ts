import { FastifyPluginAsync, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerBase, RawServerDefault } from 'fastify'

export interface User {
    id?: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    mail_verified?: number;
    createdAt?: string;
}

export interface Otp {
  id?: number;
  email: string;
  otp: string;
  createdAt?: string;
}

export interface DatabaseInterface {
    findAllUsers: () => User[];
    findUserById: (id: number) => User | undefined;
    findUserByEmail: (email: string) => User | undefined;
    createUser: (User: Omit<User, 'id' | 'createdAt'>) => User;
    updateUser: (id: number, user:Partial<User>) => boolean;
    deleteUser: (id: number) => boolean;
    findEmailOtp: (email: string) => Otp | undefined;
    findOtp: (otp: string) => Otp | undefined;
    createOtp: (Otp: Omit<Otp, 'id' | 'createdAt'>) => Otp;
}

// declare module 'fastify' {
//     interface FasitfyInstance {
//         db: DatabaseInterface;
//     }
// }

declare module 'fastify' {
    export interface FastifyInstance<
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>
  > {
      db: DatabaseInterface;
    }
  }