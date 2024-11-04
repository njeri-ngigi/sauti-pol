import { InputWithSideLabel } from '@/components/InputWithSideLabel';
import { PasswordInput } from './PasswordInput';

export function LoginForm() {
  return (
    <form className="flex flex-col font-jura">
      <InputWithSideLabel label="EMAIL" type="email" placeholder="Your email" />
      <PasswordInput />
      <button
        type="submit"
        className="p-2.5 bg-yellow1 font-bold rounded-full w-[400px] hover:bg-purple2/80 hover:text-white hover:cursor-pointer my-8"
      >
        LOGIN
      </button>
    </form>
  );
}
