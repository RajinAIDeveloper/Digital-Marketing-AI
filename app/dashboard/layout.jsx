// app/dashboard/layout.jsx
import { redirect } from 'next/navigation';
// import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

import { auth } from '@clerk/nextjs/server'
import DashboardShell from "@/app/dashboard/_components/dashboard-shell";
import UserIntializer from './_components/UserIntializer';


async function getUserData() {
  const { userId, redirectToSignIn } = await auth()
  console.log('userId:', userId);

  if (!userId) return redirectToSignIn()

    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .execute();
    
    console.log('dbUser:', dbUser);

  try {
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .execute();

    if (!dbUser || dbUser.length === 0) {
      redirect("/setup-account");
    }

    return dbUser;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw new Error('Failed to load user data');
  }
}

export default async function DashboardLayout({ children }) {

    const userData = await getUserData();
    console.log('userData:', userData);
    const userType = userData[0]?.userType;
    console.log('userType:', userType);
    
    return (
      <>
        <UserIntializer userData={userData} />
        <DashboardShell userType={userType}>
          {children}
        </DashboardShell>
      </>
    );
  }