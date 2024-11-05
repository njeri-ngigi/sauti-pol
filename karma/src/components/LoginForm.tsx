import { SubmitHandler, useForm } from 'react-hook-form';

import { ILoginInput } from './types';
import { InputWithSideLabel } from '@/components/InputWithSideLabel';
import { PasswordInput } from './PasswordInput';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginInput>();

  const onSubmit: SubmitHandler<ILoginInput> = (data: ILoginInput) => {
    console.log('Form submitted', data);
    // Call API to login user
    // handle login error
    // store token somewhere
  };

  return (
    <form className="flex flex-col font-jura" onSubmit={handleSubmit(onSubmit)}>
      <InputWithSideLabel
        fieldLabel="EMAIL"
        label="email"
        register={register}
        requiredErrorMessage="Email is required"
        type="email"
        placeholder="Your email"
        error={errors.email?.message}
      />
      <PasswordInput
        label="password"
        register={register}
        error={errors.password?.message}
      />
      <button
        type="submit"
        className="p-2.5 bg-yellow1 font-bold rounded-full w-[400px] hover:bg-purple2/80 hover:text-white hover:cursor-pointer my-8"
      >
        LOGIN
      </button>
    </form>
  );
}
