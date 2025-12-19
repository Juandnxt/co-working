import { cookies } from 'next/headers';
import sql from './db';
import { generateId } from './db';

export async function createSession(userId: string) {
  const sessionToken = crypto.randomUUID();
  const expires = new Date();
  expires.setDate(expires.getDate() + 30); // 30 days

  const sessionId = generateId();
  await sql`
    INSERT INTO "Session" (id, "sessionToken", "userId", expires, "createdAt", "updatedAt")
    VALUES (${sessionId}, ${sessionToken}, ${userId}, ${expires}, NOW(), NOW())
  `;

  const cookieStore = await cookies();
  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires,
  });

  return sessionToken;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  
  if (!sessionToken) {
    return null;
  }

  const [session] = await sql`
    SELECT s.*, u.id as user_id, u.email as user_email, u.name as user_name, u.role as user_role
    FROM "Session" s
    INNER JOIN "User" u ON s."userId" = u.id
    WHERE s."sessionToken" = ${sessionToken}
      AND s.expires > NOW()
    LIMIT 1
  `;

  if (!session) {
    return null;
  }

  return {
    user: {
      id: session.user_id,
      email: session.user_email,
      name: session.user_name,
      role: session.user_role || 'user',
    },
  };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  
  if (sessionToken) {
    await sql`
      DELETE FROM "Session"
      WHERE "sessionToken" = ${sessionToken}
    `;
  }

  cookieStore.delete('session');
}
