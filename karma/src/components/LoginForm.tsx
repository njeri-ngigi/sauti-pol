import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { InputWithSideLabel } from '@/components/InputWithSideLabel';
import { PasswordInput } from './PasswordInput';
import { useLoginMutation } from '@/services/electionsApi';
import { FaSpinner } from 'react-icons/fa6';
import classNames from 'classnames';
import { yupResolver } from '@hookform/resolvers/yup';
import { ILoginInput } from '@/store/types';
import { toast } from 'react-toastify';
import { useAuth } from '@/providers/AuthProvider';

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginInput>({
    resolver: yupResolver(schema),
  });

  const [loginUser, { isLoading }] = useLoginMutation();
  const { updateAccessToken, accessToken } = useAuth();

  if (accessToken) {
    return <div>You are already logged in</div>;
  }

  const onSubmit: SubmitHandler<ILoginInput> = async (data: ILoginInput) => {
    try {
      const res = await loginUser(data);

      if (res.data) {
        updateAccessToken(res.data?.accessToken);
        toast.success('Login successful');
      }

      if (res.error) {
        toast.error(res.error.data.message);
      }
    } catch (error) {
      // TOD (log to sentry/equivalent)
      toast.error("Sorry, we couldn't log you in. Please try again.");
    }
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
        disabled={isLoading}
        className={classNames(
          'flex items-center justify-center p-2.5 bg-yellow1 font-bold rounded-full w-[400px] hover:bg-purple2/80 hover:text-white hover:cursor-pointer my-8',
          isLoading &&
            'disabled:opacity-50 hover:bg-yellow1 hover:text-black disabled:cursor-not-allowed',
        )}
      >
        {isLoading ? <FaSpinner size={20} className="animate-spin" /> : 'LOGIN'}
      </button>
    </form>
  );
}

// TODO: fix that pesky ts error
// debounce requests to prevent spamming the server
