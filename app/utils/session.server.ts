import { createCookieSessionStorage, redirect } from "remix";
import crypto from "crypto";
import { db } from "~/utils/db.server";
import log from "~/utils/log.server";

import type { User } from "@prisma/client";

type RegisterForm = {
  email: string;
  firstName: string;
  lastName: string;
  inviteToken: string;
};

type LoginForm = {
  email: string;
  otp: string;
};

export async function generateMagicLink(user: User) {
  const token = crypto.randomBytes(32).toString("hex");
  const validUntil = new Date(Date.now() + 15 * 60 * 1000); // in 15 minutes

  const magicLink = await db.magicLink.create({
    data: { token, userId: user.id, validUntil },
  });

  return magicLink;
}

export async function generateEmailVerification(user: User) {
  const token = crypto.randomBytes(32).toString("hex");

  const emailVerification = await db.emailVerification.create({
    data: { token, userId: user.id },
  });

  return emailVerification;
}

export async function register({
  email,
  firstName,
  lastName,
  inviteToken,
}: RegisterForm) {
  const userExists = await db.user.findFirst({
    where: { email },
  });
  if (userExists) {
    return null;
  }

  let orgId;
  if (inviteToken) {
    // The user has been invited to an existing organisation
    // Retrieve the organisation from the invite token
    const invite = await db.invite.findFirst({
      where: { email, token: inviteToken, isActive: true },
    });

    if (!invite) {
      return null;
    }

    orgId = invite.orgId;

    // Invalidate the invite
    await db.invite.updateMany({
      data: { isActive: false },
      where: { email, token: inviteToken },
    });
  }

  // Create user
  const user = await db.user.create({
    data: {
      email,
      firstName,
      lastName,
      // We consider the email as verified if the user has been invited
      isEmailVerified: Boolean(orgId),
    },
  });

  // Create user-org relationship
  if (orgId) {
    await db.userOrg.create({
      data: {
        userId: user.id,
        orgId,
      },
    });
  } else {
    // Send confirmation email
    // TODO
    const emailVerification = await generateEmailVerification(user);
    console.log(emailVerification);
  }

  return user;
}

export async function login({ email, otp }: LoginForm) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  // Login with OTP
  const magicLink = await db.magicLink.findFirst({
    where: {
      userId: user.id,
      isUsed: false,
      validUntil: { lt: new Date(Date.now()) },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!magicLink) {
    return null;
  }

  const isCorrectOTP = magicLink.token === otp;

  if (!isCorrectOTP) {
    return null;
  }

  return user;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "analytics-service_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function createUserSession(user: User, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", user.id);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
