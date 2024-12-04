import { LoadingState } from '@/components/LoadingState';
import { LoginPrompt } from '@/components/LoginPrompt';
import { SignupForm } from '@/components/SignupForm';
import { useAuth } from '@/providers/AuthProvider';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Signup() {
  const { accessToken, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <LoadingState />;
  }

  if (accessToken) {
    router.push('/home');
    return <></>;
  }
  return (
    <>
      <Head>
        <title>Karma | Sign up</title>
      </Head>
      <div className="flex flex-col items-center justify-evenly pt-16 pb-8 h-[100vh] text-black3">
        <div className="flex flex-col items-center">
          <h1 className="font-majormono text-4xl">sign up to KARMA</h1>
          <p className="font-reenie text-2xl">Your opinion counts</p>
        </div>
        <SignupForm />
        <LoginPrompt />
      </div>
    </>
  );
}
