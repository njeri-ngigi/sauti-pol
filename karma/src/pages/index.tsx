import Head from 'next/head';
import { LoginPrompt } from '@/components/LoginPrompt';
import { SignupPrompt } from '@/components/SignupPrompt';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/router';
import { LoadingState } from '@/components/LoadingState';

export default function Main() {
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
        <title>Karma</title>
      </Head>
      <div className="w-full h-[100vh] p-8 flex flex-col items-center justify-between">
        <div className="text-center mt-64">
          <h1 className="font-majormono text-6xl text-center">
            Welcome to KARMA
          </h1>
          <p className="font-reenie text-2xl">Your opinion counts</p>
        </div>
        <div className="flex flex-col items-center pb-12">
          <SignupPrompt />
          <LoginPrompt />
        </div>
      </div>
    </>
  );
}
