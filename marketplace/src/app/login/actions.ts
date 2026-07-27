"use server";

import { createSession, destroySession } from "@/lib/auth";
import { DEMO_USERS, isDemoUserKey } from "@/lib/demo-users";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

function safeDashboardPath(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "/dashboard";
  return /^\/dashboard(?:[/?#]|$)/.test(value) ? value : "/dashboard";
}

export async function startDemoSession(formData: FormData): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Demo session selector is disabled in production");
  }

  const demoUser = formData.get("demoUser");

  if (!isDemoUserKey(demoUser)) {
    throw new Error("Unknown demo user");
  }

  const user = await prisma.user.findUnique({
    where: { email: DEMO_USERS[demoUser].email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("Run npm run db:seed before starting the lab");
  }

  await createSession(user.id);
  redirect(safeDashboardPath(formData.get("from")));
}

export async function endDemoSession(): Promise<void> {
  await destroySession();
  redirect("/login");
}
