import { type Ref } from "react";
import Input from "./Input";
import Button from "./Button";

type AddBoardProp = {
  titleRef: Ref<HTMLInputElement>;
  descriptionRef: Ref<HTMLTextAreaElement>;
  setIsOpenAddOrgBox: (val: boolean) => void;
};

export default function AddBoard(addOrgData: AddBoardProp) {
  return (
    <div className="absolute right-0 sm:right-0 left-0 sm:left-auto bg-sky-100 p-3 rounded-2xl z-10 flex flex-col gap-3 w-full sm:w-auto sm:min-w-[320px]">
      <Input
        type="text"
        placeholder="enter title"
        inputRef={addOrgData.titleRef}
        className="w-full sm:w-80"
      />

      <textarea
        ref={addOrgData.descriptionRef}
        placeholder="enter description"
        className="resize-none outline-none p-2 h-40 bg-white rounded-md w-full sm:w-80 placeholder:text-xs text-xs"
      />

      <Button
        text="Cancel"
        className="bg-red-600 w-full"
        onClick={() => addOrgData.setIsOpenAddOrgBox(false)}
      />
    </div>
  );
}
