// app/dashboard/layout.tsx
import { auth, currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import DashboardShell from "@/app/dashboard/_components/dashboard-shell";
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardLayout({
  children,
}) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/sign-in');
  }

  // Get user from database
  const dbUser = await db.select()
    .from(users)
    .where(eq(users.userId, userId))
    .limit(1);

  if (!dbUser.length) {
    redirect('/');
  }

  // Determine dashboard type and redirect if needed
  const userType = dbUser[0].userType;
  const path = window.location.pathname;
  
  if (path === '/dashboard') {
    redirect(userType === 'admin' ? '/dashboard/admin' : '/dashboard/seller');
  }

  return (
    <DashboardShell userType={userType}>
      {children}
    </DashboardShell>
  );
}