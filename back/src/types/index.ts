import {
  FastifyPluginAsync,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
} from "fastify";
import { Transporter } from "nodemailer";

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
  createUser: (User: Omit<User, "id" | "createdAt">) => User;
  updateUser: (id: number, user: Partial<User>) => boolean;
  deleteUser: (id: number) => boolean;
  findEmailOtp: (email: string) => Otp | undefined;
  findOtp: (otp: string) => Otp | undefined;
  createOtp: (Otp: Omit<Otp, "id" | "createdAt">) => Otp;
}

export interface FastifyMailerNamedInstance {
  [namespace: string]: Transporter;
}

export type FastifyMailer = FastifyMailerNamedInstance & Transporter;

declare module "fastify" {
  export interface FastifyInstance {
    db: DatabaseInterface;
    mailer: FastifyMailer;
  }
}
