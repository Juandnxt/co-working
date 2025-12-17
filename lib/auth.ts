import sql from './db';
import bcrypt from 'bcryptjs';
import { sendVerificationCode, sendWelcomeEmail } from './email';
import { generateId } from './db';

export async function generateVerificationCode(): Promise<string> {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = generateId();
  
  // Create user
  const [user] = await sql`
    INSERT INTO "User" (id, email, password, name, "createdAt", "updatedAt")
    VALUES (${userId}, ${email}, ${hashedPassword}, ${name}, NOW(), NOW())
    RETURNING id, email, name, "createdAt", "updatedAt"
  `;

  // Generate and send verification code
  const code = await generateVerificationCode();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  const codeId = generateId();
  await sql`
    INSERT INTO "VerificationCode" (id, code, email, "userId", "expiresAt", used, "createdAt")
    VALUES (${codeId}, ${code}, ${email}, ${userId}, ${expiresAt}, false, NOW())
  `;

  await sendVerificationCode(email, code);

  return user;
}

export async function verifyCode(email: string, code: string) {
  // Find valid verification code
  const [verificationCode] = await sql`
    SELECT vc.*, u.id as user_id, u.email as user_email, u.name as user_name
    FROM "VerificationCode" vc
    LEFT JOIN "User" u ON vc."userId" = u.id
    WHERE vc.email = ${email}
      AND vc.code = ${code}
      AND vc.used = false
      AND vc."expiresAt" > NOW()
    ORDER BY vc."createdAt" DESC
    LIMIT 1
  `;

  if (!verificationCode) {
    return null;
  }

  // Mark code as used
  await sql`
    UPDATE "VerificationCode"
    SET used = true
    WHERE id = ${verificationCode.id}
  `;

  // Update user email as verified
  await sql`
    UPDATE "User"
    SET "emailVerified" = NOW(), "updatedAt" = NOW()
    WHERE id = ${verificationCode.user_id}
  `;

  // Get updated user
  const [user] = await sql`
    SELECT id, email, name, "emailVerified", "createdAt", "updatedAt"
    FROM "User"
    WHERE id = ${verificationCode.user_id}
  `;

  // Send welcome email
  await sendWelcomeEmail(user.email, user.name || 'User');

  return user;
}

export async function loginUser(email: string, password: string) {
  // Find user by email
  const [user] = await sql`
    SELECT id, email, name, password
    FROM "User"
    WHERE email = ${email}
    LIMIT 1
  `;

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }

  // Generate 2FA code
  const code = await generateVerificationCode();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  const codeId = generateId();
  await sql`
    INSERT INTO "VerificationCode" (id, code, email, "userId", "expiresAt", used, "createdAt")
    VALUES (${codeId}, ${code}, ${email}, ${user.id}, ${expiresAt}, false, NOW())
  `;

  await sendVerificationCode(email, code);

  return { user: { id: user.id, email: user.email, name: user.name }, requires2FA: true };
}

export async function verifyLoginCode(email: string, code: string) {
  // Find valid verification code
  const [verificationCode] = await sql`
    SELECT vc.*, u.id as user_id, u.email as user_email, u.name as user_name
    FROM "VerificationCode" vc
    LEFT JOIN "User" u ON vc."userId" = u.id
    WHERE vc.email = ${email}
      AND vc.code = ${code}
      AND vc.used = false
      AND vc."expiresAt" > NOW()
    ORDER BY vc."createdAt" DESC
    LIMIT 1
  `;

  if (!verificationCode) {
    return null;
  }

  // Mark code as used
  await sql`
    UPDATE "VerificationCode"
    SET used = true
    WHERE id = ${verificationCode.id}
  `;

  // Return user
  const [user] = await sql`
    SELECT id, email, name, "createdAt", "updatedAt"
    FROM "User"
    WHERE id = ${verificationCode.user_id}
  `;

  return user;
}
