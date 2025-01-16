// components/Header.tsx
"use client";
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* Replace with your actual logo */}
          <h1 className="text-xl font-bold">Devmira</h1>
        </Link>
        
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <UserButton afterSignOutUrl="/" />
              <SignOutButton>
                <Button variant="outline">Sign out</Button>
              </SignOutButton>
            </>
          ) : (
            <Link href='/sign-in'>
            <Button>Get Started</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}