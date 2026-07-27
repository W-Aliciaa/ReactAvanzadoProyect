import { jwtVerify, SignJWT } from "jose";

const SESSION_ISSUER = "marketplace";
const SESSION_ALGORITHM = "HS256";
const SESSION_DURATION = "2h";
export const SESSION_COOKIE = "marketplace-session";

export type Session = {
  userId: number;
};

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }

  return new TextEncoder().encode(secret);
}

export async function signSessionToken(userId: number): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: SESSION_ALGORITHM })
    .setSubject(String(userId))
    .setIssuer(SESSION_ISSUER)
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<Session> {
  const { payload } = await jwtVerify(token, getSecret(), {
    algorithms: [SESSION_ALGORITHM],
    issuer: SESSION_ISSUER,
  });
  const userId = Number(payload.sub);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error("Session subject is invalid");
  }

  return { userId };
}
