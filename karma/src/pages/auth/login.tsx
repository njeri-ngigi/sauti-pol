import Head from 'next/head';
import { LoginForm } from '../../components/LoginForm';
import { SignupPrompt } from '@/components/SignupPrompt';

export default function Login() {
  return (
    <>
      <Head>
        <title>Karma | Log in</title>
      </Head>
      <div className="flex flex-col items-center justify-evenly pt-16 pb-8 h-[100vh] text-black3">
        <div className="flex flex-col items-center">
          <h1 className="font-majormono text-4xl">log in to KARMA</h1>
          <p className="font-reenie text-2xl">Your opinion counts</p>
        </div>
        <LoginForm />
        <SignupPrompt />
      </div>
    </>
  );
}
