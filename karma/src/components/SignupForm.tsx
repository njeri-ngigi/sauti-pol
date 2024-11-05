import * as yup from 'yup';

import { ISignupInput } from './types';
import { InputWithSideLabel } from '@/components/InputWithSideLabel';
import { PasswordInput } from './PasswordInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup
      .string()
      .min(10)
      .test({
        name: 'password',
        test: (value, ctx) => {
          if (!value || value.length === 0) {
            return ctx.createError({
              message: 'Password is required',
            });
          }

          const hasUpperCase = /[A-Z]/.test(value);
          if (!hasUpperCase) {
            return ctx.createError({
              message: 'Password must contain at least one uppercase letter',
            });
          }

          const hasDigits = /\d/.test(value);
          if (!hasDigits) {
            return ctx.createError({
              message: 'Password must contain at least one number',
            });
          }

          const hasSpecialCharacters = /[^a-zA-Z0-9]/i.test(value);
          if (!hasSpecialCharacters) {
            return ctx.createError({
              message: 'Password must contain at least one special character',
            });
          }

          return true;
        },
      })
      .required(),
  })
  .required();

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignupInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: ISignupInput) => {
    console.log('Form submitted', data);

    // Call API to signup user
    // handle signup error
    // store token somewhere
  };

  return (
    <form className="flex flex-col font-jura" onSubmit={handleSubmit(onSubmit)}>
      <InputWithSideLabel
        fieldLabel="F. NAME"
        label="firstName"
        requiredErrorMessage="First name is required"
        register={register}
        type="text"
        placeholder="first name"
        error={errors.firstName?.message}
      />
      <InputWithSideLabel
        fieldLabel="L. NAME"
        label="lastName"
        requiredErrorMessage="Last name is required"
        register={register}
        type="text"
        placeholder="last name"
        error={errors.lastName?.message}
      />
      <InputWithSideLabel
        fieldLabel="EMAIL"
        label="email"
        requiredErrorMessage="Email is required"
        register={register}
        type="email"
        placeholder="your email"
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
        SIGNUP
      </button>
    </form>
  );
}
