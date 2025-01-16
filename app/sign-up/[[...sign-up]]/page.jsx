// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp afterSignUpUrl="/dashboard" signInUrl="/sign-in" />
    </div>
  );
}