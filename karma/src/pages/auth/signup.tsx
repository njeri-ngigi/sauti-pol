import { LoginPrompt } from '@/components/LoginPrompt';
import { SignupForm } from '@/components/SignupForm';
import Head from 'next/head';

export default function Signup() {
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
