import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { InputHTMLAttributes, ReactNode } from 'react';

import classNames from 'classnames';

interface InputWithSideLabelProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  fieldLabel: string | ReactNode;
  label: Path<T>;
  register: UseFormRegister<T>;

  requiredErrorMessage?: string;
  error?: string;
}

export function InputWithSideLabel<T extends FieldValues>({
  fieldLabel,
  label,
  error,
  register,
  requiredErrorMessage,
  ...props
}: InputWithSideLabelProps<T>) {
  return (
    <div>
      <span className="text-xs pl-8 !text-red1">{error}</span>
      <div
        className={classNames(
          'flex flex-row bg-purple1 rounded-full py-2.5 pl-10 pr-6 mb-4 text-black2 text-base',
          error && 'bg-red2',
        )}
      >
        <input
          {...props}
          className={classNames(
            'border-r border-gray2 w-5/6 focus:outline-none bg-purple1 pr-4 placeholder:font-thin',
            error && 'bg-red2',
          )}
          {...register(label, { required: requiredErrorMessage })}
        />
        <div
          className={classNames(
            'flex text-xs text-gray1 flex-row w-1/6 items-center justify-center ml-4',
            error && 'text-red1/70',
          )}
        >
          {fieldLabel}
        </div>
      </div>
    </div>
  );
}
