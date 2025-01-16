// lib/auth.ts
import { auth, currentUser } from '@clerk/nextjs'
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getCurrentUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const user = await currentUser();
  
  if (!user) {
    return null;
  }

  const dbUser = await db.select()
    .from(users)
    .where(eq(users.userId, userId))
    .limit(1);

  if (!dbUser.length) {
    return null;
  }

  return {
    ...dbUser[0],
    clerkId: userId,
    emailAddresses: user.emailAddresses
  };
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.userType === 'admin';
}

export async function isSeller() {
  const user = await getCurrentUser();
  return user?.userType === 'seller';
}