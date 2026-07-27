export const DEMO_USERS = {
  A: {
    email: "ana@example.test",
    displayName: "Ana",
    projectTitle: "Proyecto de Ana",
  },
  B: {
    email: "pepe@example.test",
    displayName: "Pepe",
    projectTitle: "Proyecto de Pepe",
  },
} as const;

export type DemoUserKey = keyof typeof DEMO_USERS;

export function isDemoUserKey(value: unknown): value is DemoUserKey {
  return typeof value === "string" && value in DEMO_USERS;
}
