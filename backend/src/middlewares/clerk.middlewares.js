import {
  clerkClient,
  ClerkExpressWithAuth,
  requireAuth,
} from "@clerk/clerk-sdk-node";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const userList = await clerkClient.users.getUserList();

export const clerkMiddleware = ClerkExpressWithAuth({
  apiKey: process.env.CLERK_SECRET_KEY,
});

export const clerkReqAuth = requireAuth();
