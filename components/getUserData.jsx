import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm"; 
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

async function getUserData() {
    const { userId, redirectToSignIn } = await auth()
    console.log('userId:', userId);
  
    if (!userId) return redirectToSignIn()
  
    try {
      
       const dbUser = await db
        .select()
        .from(users)
        .where(eq(users.userId, userId))
        .execute();
      
        console.log('dbUser:', dbUser);
  
  
       if (!dbUser || dbUser.length === 0) {
         redirect("/setup-account");
       }
  
        return dbUser;
  
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw new Error('Failed to load user data');
    }
  }

export default getUserData; 