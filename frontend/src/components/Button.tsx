import React from "react";

type ButtonProp = {
  text?: string;
  className?: string;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Button(buttonProp: ButtonProp) {
  return (
    <button
      className={`${buttonProp.className} cursor-pointer rounded-md border border-neutral-600 bg-neutral-900 px-4 py-1.5   text-xs text-neutral-50 ring-2 ring-neutral-900 transition-all duration-700 ease-out hover:border-neutral-500 hover:shadow-[inset_0px_0px_20px_rgba(255,255,255,0.3)]`}
      onClick={(e) => buttonProp.onClick?.(e)}
    >
      {buttonProp.text ? buttonProp.text : buttonProp.icon}
    </button>
  );
}
