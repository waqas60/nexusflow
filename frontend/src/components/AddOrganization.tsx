import React, { type Ref } from "react";
import Input from "./Input";
import Button from "./Button";

type AddOrgProp = {
  titleRef: Ref<HTMLInputElement>;
  descriptionRef: Ref<HTMLTextAreaElement>;
  setIsOpenAddOrgBox: (val: boolean) => void;
  addOrg: (e: React.MouseEvent) => Promise<void>;
};

export default function AddOrganization(addOrgData: AddOrgProp) {
  return (
    <div className="absolute right-2 left-2 sm:left-auto sm:right-0 bg-sky-100 p-3 rounded-2xl z-10 flex flex-col gap-3 w-auto sm:w-96 shadow-lg">
      <Input
        type="text"
        placeholder="enter title"
        inputRef={addOrgData.titleRef}
        className="w-full"
      />

      <textarea
        ref={addOrgData.descriptionRef}
        placeholder="enter description"
        className="resize-none outline-none p-2 h-32 sm:h-40 bg-white rounded-md w-full placeholder:text-xs text-xs"
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          text="Add"
          className="bg-neutral-600 w-full"
          onClick={(e) => addOrgData.addOrg(e)}
        />
        <Button
          text="Cancel"
          className="bg-red-600 w-full"
          onClick={() => addOrgData.setIsOpenAddOrgBox(false)}
        />
      </div>
    </div>
  );
}
