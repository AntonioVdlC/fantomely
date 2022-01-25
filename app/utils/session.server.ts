import { createCookieSessionStorage, redirect } from "remix";
import crypto from "crypto";
import { db } from "~/utils/db.server";
import log from "~/utils/log.server";

import type { User } from "@prisma/client";

type RegisterForm = {
  email: string;
  firstName: string;
  lastName: string;
};

type LoginForm = {
  email: string;
  token: string;
};

export async function generateMagicLink(email: string) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const validUntil = new Date(Date.now() + 15 * 60 * 1000); // in 15 minutes

  const magicLink = await db.magicLink.create({
    data: { token, userId: user.id, validUntil },
  });

  return magicLink;
}

export async function register({ email, firstName, lastName }: RegisterForm) {
  const userExists = await db.user.findFirst({
    where: { email },
  });
  if (userExists) {
    return null;
  }

  // Create user
  const user = await db.user.create({
    data: {
      email,
      firstName,
      lastName,
    },
  });

  return user;
}

export async function login({ email, token }: LoginForm) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  // Login with Token
  const magicLink = await db.magicLink.findFirst({
    where: {
      userId: user.id,
      isUsed: false,
      validUntil: { gte: new Date(Date.now()) },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!magicLink) {
    return null;
  }

  const isCorrectToken = magicLink.token === token;

  if (!isCorrectToken) {
    return null;
  }

  // Set magic link as used
  try {
    await db.magicLink.update({
      data: { isUsed: true },
      where: { id: magicLink.id },
    });
  } catch {
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
    throw redirect(`/auth/login?${searchParams}`, {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });
  }
  return userId;
}
export async function requireCurrentUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);

  try {
    const userId = await requireUserId(request, redirectTo);
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { orgs: { include: { org: true } } },
    });
    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  } catch {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);

    throw redirect(`/auth/login?${searchParams}`, {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });
  }
}

export async function requireValidSession(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);

  try {
    const userId = await requireUserId(request, redirectTo);
    const user = await db.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User not found.");
    }
  } catch {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);

    throw redirect(`/auth/login?${searchParams}`, {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });
  }
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
  return redirect("/auth/logout/callback", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
