import type { GetServerSidePropsContext } from "next";
import type {
  User} from "next-auth";
import {
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import EmailProvider, { type SendVerificationRequestParams } from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../env.mjs";
import { prisma } from "./db";

import { readFileSync } from 'fs';
import path from 'path';
import Handlebars from "handlebars";
import { createTransport } from 'nodemailer';
import type { Options } from "nodemailer/lib/smtp-transport/index.js";
import type SMTPConnection from "nodemailer/lib/smtp-connection/index.js";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session {
    user?: User
    expires: string;
  }

  interface User {
    id: string
    email?: string
    firstName?: string
    lastName?: string
    image?: string
    username?: string
    setData: boolean
  }
}

const emailsDir = path.resolve(process.cwd(), './src/emails');
const transporter = createTransport({
  host: env.EMAIL_SERVER,
  port: env.EMAIL_PORT,
  auth: {
    user: env.EMAIL_USERNAME,
    pass: env.EMAIL_PASSWORD,
  },
  secure: true,
} as unknown as SMTPConnection.Options);

const sendVerificationRequest = async ({ identifier, url } : SendVerificationRequestParams) => {
  const emailFile = readFileSync(path.join(emailsDir, 'confirm-email.html'), {
    encoding: 'utf8',
  });
  const emailTemplate = Handlebars.compile(emailFile);
  await transporter.sendMail({
    from: `"✨ Benjibook" ${env.EMAIL_FROM}`,
    to: identifier,
    subject: 'Your sign-in link for Benjibook',
    html: emailTemplate({
      base_url: env.NEXTAUTH_URL,
      signin_url: url,
      email: identifier,
    }),
  });
}

const sendWelcomeEmail = async ({ user } : { user: User }) => {
  const { email } = user;

  try {
    const emailFile = readFileSync(path.join(emailsDir, 'welcome.html'), {
      encoding: 'utf8',
    });
    const emailTemplate = Handlebars.compile(emailFile);
    await transporter.sendMail({
      from: `"✨ SupaVacation" ${env.EMAIL_FROM}`,
      to: email,
      subject: 'Welcome to SupaVacation! 🎉',
      html: emailTemplate({
        base_url: env.NEXTAUTH_URL,
        support_email: 'benrieth3@gmail.com',
      }),
    });
  } catch (error) {
    console.log(`❌ Unable to send welcome email to user (${email as string})`);
  }
};

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.email = user.email;
        session.user.firstName = user.firstName;
        session.user.lastName = user.lastName;
        session.user.image = user.image;
        session.user.username = user.username;
        session.user.setData = user.setData;
        delete session.user.name
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      // server: {
      //   host: env.EMAIL_SERVER,
      //   port: env.EMAIL_PORT,
      //   auth: {
      //     user: env.EMAIL_USERNAME,
      //     pass: env.EMAIL_PASSWORD,
      //   }
      // },
      // from: env.EMAIL_FROM,
      sendVerificationRequest,
      maxAge: 10 * 60,
    })
  ],
  pages: {
    signIn: '/',
    error: '/',
    newUser: '/onboarding',
    verifyRequest: '/',
  },
  events: { 
    createUser: sendWelcomeEmail 
  }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
