import { createCookieSessionStorage, redirect } from "remix";
import crypto from "crypto";
import { db } from "~/utils/db.server";
import log from "~/utils/log.server";

import type { AdminSession, Org, User, UserOrg } from "@prisma/client";

type RegisterForm = {
  email: string;
  firstName: string;
  lastName: string;
};

type JoinWaitlistForm = {
  email: string;
};

type LoginForm = {
  email: string;
  token: string;
};

export function generateRandomString(size = 32) {
  return crypto.randomBytes(32).toString("hex");
}

export async function generateMagicLink(email: string) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const token = generateRandomString(32);
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

export async function joinWaitlist({ email }: JoinWaitlistForm) {
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
      isBeta: true,
      isInWaitlist: true,
    },
  });

  return user;
}

export async function loginWaitlist({ email, token }: LoginForm) {
  const user = await db.user.findFirst({
    where: { email, waitlistToken: token, isInWaitlist: true },
    include: { orgs: { include: { org: true } } },
  });

  if (!user) {
    return null;
  }

  return user;
}

export async function login({ email, token }: LoginForm) {
  const user = await db.user.findUnique({
    where: { email },
    include: { orgs: { include: { org: true } } },
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

const adminStorage = createCookieSessionStorage({
  cookie: {
    name: "analytics-service_admin-session",
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

export function getAdminSession(request: Request) {
  return adminStorage.getSession(request.headers.get("Cookie"));
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
    const orgId = await requireOrgId(request, redirectTo);

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { orgs: { include: { org: true } } },
    });
    const currentOrg = await db.org.findUnique({ where: { id: orgId } });
    const currentUserOrg = await db.userOrg.findFirst({
      where: { userId, orgId },
    });

    if (!currentOrg || !currentUserOrg) {
      throw new Error("Org not found.");
    }
    if (!user) {
      throw new Error("User not found.");
    }

    return {
      ...user,
      currentOrg: { ...currentOrg, role: currentUserOrg.role },
    };
  } catch {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);

    throw redirect(`/auth/login?${searchParams}`, {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });
  }
}

export async function requireOrgId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const orgId = session.get("orgId");
  if (!orgId || typeof orgId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/auth/login?${searchParams}`, {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });
  }
  return orgId;
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

export async function createUserSession(
  user: User & {
    orgs: (UserOrg & {
      org: Org;
    })[];
  },
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set("userId", user.id);
  if (user.orgs?.[0]?.org?.id) {
    session.set("orgId", user.orgs[0].org.id);
  }

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

type SetCurrentOrgData = {
  user: User;
  org: Org;
};

export async function setCurrentOrg(
  { user, org }: SetCurrentOrgData,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set("userId", user.id);
  session.set("orgId", org.id);

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

export async function logoutAdmin(request: Request) {
  const session = await adminStorage.getSession(request.headers.get("Cookie"));
  return redirect("/auth/logout/callback", {
    headers: {
      "Set-Cookie": await adminStorage.destroySession(session),
    },
  });
}

export async function requireAdminSession(request: Request) {
  const session = await getAdminSession(request);

  const token = session.get("adminSessionToken");
  if (!token || typeof token !== "string") {
    throw redirect(`/admin/login`, {
      headers: {
        "Set-Cookie": await adminStorage.destroySession(session),
      },
    });
  }

  const validUntil = new Date(session.get("adminSessionValidUntil"));
  if (validUntil < new Date()) {
    throw redirect(`/admin/login`, {
      headers: {
        "Set-Cookie": await adminStorage.destroySession(session),
      },
    });
  }

  return { token };
}

export async function createAdminSession(adminSession: AdminSession) {
  const session = await adminStorage.getSession();
  session.set("adminSessionToken", adminSession.token);
  session.set("adminSessionValidUntil", adminSession.validUntil.toISOString());

  return redirect("/admin/dashboard", {
    headers: {
      "Set-Cookie": await adminStorage.commitSession(session),
    },
  });
}
