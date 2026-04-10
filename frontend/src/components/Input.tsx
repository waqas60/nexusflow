import { type Ref } from "react";

type InputProp = {
  type: string;
  placeholder: string;
  className?: string;
  inputRef: Ref<HTMLInputElement>;
};

export default function Input(input: InputProp) {
  return (
    <input
      type={input.type}
      placeholder={input.placeholder}
      ref={input.inputRef}
      className={`${input.className} outline-none text-xs p-2 bg-neutral-50 rounded-md w-80 placeholder:text-xs`}
    />
  );
}
