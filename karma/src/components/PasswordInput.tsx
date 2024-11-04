import { useState } from "react";
import { InputWithSideLabel } from "./InputWithSideLabel";
import { BsEyeFill, BsEyeSlash } from 'react-icons/bs';

export function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  return (
      <InputWithSideLabel
        label={
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
      />
  );
}