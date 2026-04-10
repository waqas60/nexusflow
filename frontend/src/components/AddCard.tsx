import { type Ref } from "react";
import Input from "./Input";
import Button from "./Button";

type AddCardProp = {
  titleRef: Ref<HTMLInputElement>;
  descriptionRef: Ref<HTMLTextAreaElement>;
  difficultyRef: Ref<HTMLSelectElement>;
  statusRef: Ref<HTMLSelectElement>;
  setIsOpenAddCardBox: (val: boolean) => void;
};

export default function AddCard(addCardData: AddCardProp) {
  return (
    <div className="absolute right-10 bg-sky-200 p-5 rounded-2xl z-10 flex flex-col gap-5">
      <Input
        type="text"
        placeholder="enter title"
        inputRef={addCardData.titleRef}
      />
      <textarea
        ref={addCardData.descriptionRef}
        placeholder="enter description"
        className="resize-none outline-none p-2 h-40 bg-white rounded-md w-80 placeholder:text-sm text-sm"
      ></textarea>

      <select
        ref={addCardData.difficultyRef}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>

      <select
        ref={addCardData.statusRef}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <option value="not_taken">not_taken</option>
        <option value="pending">pending</option>
        <option value="done">done</option>
      </select>
      <Button
        text="Cancel"
        className="bg-red-600"
        onClick={() => addCardData.setIsOpenAddCardBox(false)}
      />
    </div>
  );
}
