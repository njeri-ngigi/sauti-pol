import Link from 'next/link';

export function LoginPrompt() {
  return (
    <div className="font-jura">
      <span>Already have an account?</span>
      <Link
        className="text-blue1 ml-1 underline decoration-1 underline-offset-1"
        href="/auth/login"
      >
        Log In
      </Link>
    </div>
  );
}
