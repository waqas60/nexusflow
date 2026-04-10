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
      className={`${buttonProp.className} p-2 text-xs rounded-md bg-neutral-950 text-white hover:bg-neutral-700 duration-300 cursor-pointer`}
      onClick={(e) => buttonProp.onClick?.(e)}
    >
      {buttonProp.text ? buttonProp.text : buttonProp.icon}
    </button>
  );
}
