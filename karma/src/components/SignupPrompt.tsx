import Link from "next/link";

export function SignupPrompt() {
  return (
    <div className="font-jura">
      <span>No account?</span>
      <Link
        className="text-blue1 ml-1 underline decoration-1 underline-offset-1"
        href="/auth/signup"
      >
        Sign Up
      </Link>
    </div>
  );
}
