import { InputWithSideLabel } from '@/components/InputWithSideLabel';
import { PasswordInput } from './PasswordInput';

export function SignupForm() {
  return (
    <form className="flex flex-col font-jura">
      <InputWithSideLabel label="F. NAME" type="text" placeholder="first name" />
      <InputWithSideLabel label="L. NAME" type="text" placeholder="last name" />
      <InputWithSideLabel label="EMAIL" type="email" placeholder="your email" />
      <PasswordInput />
      <button
        type="submit"
        className="p-2.5 bg-yellow1 font-bold rounded-full w-[400px] hover:bg-purple2/80 hover:text-white hover:cursor-pointer my-8"
      >
        SIGNUP
      </button>
    </form>
  );
}
