import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { createAccount, retrieveAccount } from "@convex-dev/auth/server";
import { Scrypt } from "lucia";
import type { DataModel } from "./_generated/dataModel";

/**
 * Direct credentials provider — handles signup & login for any email
 * without email verification. Uses Scrypt for password hashing.
 */
export const DirectCredentials = ConvexCredentials<DataModel>({
  id: "credentials",
  crypto: {
    async hashSecret(password: string) {
      return await new Scrypt().hash(password);
    },
    async verifySecret(password: string, hash: string) {
      return await new Scrypt().verify(hash, password);
    },
  },
  authorize: async (params, ctx) => {
    const email = params.email as string;
    const password = params.password as string;
    const flow = params.flow as string;

    if (!email) {
      throw new Error("Email is required");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    if (flow === "signUp") {
      // Check if account exists — if so, just sign them in
      try {
        const existing = await retrieveAccount(ctx, {
          provider: "credentials",
          account: {
            id: email,
            secret: password,
          },
        });
        return { userId: existing.user._id };
      } catch {
        // Account doesn't exist, create new
      }

      const { user } = await createAccount(ctx, {
        provider: "credentials",
        account: {
          id: email,
          secret: password,
        },
        profile: {
          email,
          name: (params.name as string) || email.split("@")[0],
          emailVerificationTime: Date.now(),
        },
        shouldLinkViaEmail: false,
      });

      return { userId: user._id };
    }

    // Sign-in flow
    const result = await retrieveAccount(ctx, {
      provider: "credentials",
      account: {
        id: email,
        secret: password,
      },
    });

    return { userId: result.user._id };
  },
});
