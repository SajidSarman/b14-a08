import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const mongoUri = requiredEnv("MONGODB_URI");
const authSecret = requiredEnv("BETTER_AUTH_SECRET");
const authUrl = requiredEnv("BETTER_AUTH_URL");
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (Boolean(googleClientId) !== Boolean(googleClientSecret)) {
  throw new Error(
    "Set both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google sign-in."
  );
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};
const client =
  globalForMongo.mongoClient ?? new MongoClient(mongoUri);
if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db("StudioSpace-B14-A08");

export const auth = betterAuth({
  baseURL: authUrl,
  secret: authSecret,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },

  hooks: {
    before: createAuthMiddleware(async (context) => {
      if (context.path !== "/sign-up/email") {
        return;
      }

      const password = context.body?.password;
      if (typeof password !== "string" || password.length < 6) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must be at least 6 characters.",
        });
      }
      if (!/[A-Z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must include at least one uppercase letter.",
        });
      }
      if (!/[a-z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must include at least one lowercase letter.",
        });
      }
    }),
  },
  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        },
      }
    : {}),

  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: 'jwt',
      maxAge: 7 * 24 * 60 * 60,

    }
  }
  
});