import { BsEyeFill, BsEyeSlash } from 'react-icons/bs';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { InputHTMLAttributes, useState } from 'react';

import { InputWithSideLabel } from './InputWithSideLabel';

interface PasswordInputProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<T>;
  label: Path<T>;
  error?: string;
}

export function PasswordInput<T extends FieldValues>(
  props: PasswordInputProps<T>,
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputWithSideLabel<T>
      fieldLabel={
        showPassword ? (
          <BsEyeFill
            className="cursor-pointer hover:text-blue1"
            size={20}
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <BsEyeSlash
            className="cursor-pointer hover:text-blue1"
            size={20}
            onClick={() => setShowPassword(!showPassword)}
          />
        )
      }
      title={showPassword ? 'Hide password' : 'Show password'}
      placeholder="password"
      type={showPassword ? 'text' : 'password'}
      requiredErrorMessage="Password is required"
      {...props}
    />
  );
}
