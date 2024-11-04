import classNames from 'classnames';
import { InputHTMLAttributes, ReactNode } from 'react';

interface InputWithSideLabelProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string | ReactNode;
  error?: string;
}

export function InputWithSideLabel({
  label,
  error,
  ...props
}: InputWithSideLabelProps) {
  return (
    <div>
      {error && <span className="text-xs pl-8 text-red1/70">{error}</span>}
      <div
        className={classNames(
          'flex flex-row bg-purple1 rounded-full py-2.5 pl-10 pr-6 mb-6 text-black2 text-base',
          error && 'bg-red2',
        )}
      >
        <input
          {...props}
          className={classNames(
            'border-r border-gray2 w-5/6 focus:outline-none bg-purple1 pr-4',
            error && 'bg-red2',
          )}
        />
        <div
          className={classNames(
            'flex text-xs text-gray1 flex-row w-1/6 items-center justify-center ml-4',
            error && 'text-red1/70',
          )}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
