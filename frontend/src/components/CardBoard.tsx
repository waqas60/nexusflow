import { useRef, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { HiOutlineIdentification } from "react-icons/hi";
import api from "../lib/axios";

type CardBoardProp = {
  id: string;
  orgId: string;
  title: string;
  description: string;
  members: string[];
  createdAt: string;
  createdBy: string;
  getAllBoards: () => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
};

export default function CardBoard(card: CardBoardProp) {
  const memberRef = useRef<HTMLInputElement>(null);
  const [isMemberCardOpen, setisMemberCardOpen] = useState(false);
  const navigate = useNavigate();

  const addMemberInBoard = async (id: string) => {
    setisMemberCardOpen(true);
    if (memberRef.current) {
      try {
        const response = await api.post(
          `/api/board/${card.orgId}/${id}/members`,
          {
            email: memberRef.current.value,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          },
        );
        const data = response.data;
        if (data.success) {
          await card.getAllBoards();
          setisMemberCardOpen(false);
          toast.success(data.message);
        }
      } catch (error: any) {
        if (!error.response.data.success) {
          toast.error(error.response.data.message);
        }
      }
    }
  };

  return (
    <div className="p-4 rounded-2xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] w-full hover:scale-[1.02] duration-300 text-xs">
      <div className="flex justify-between items-start gap-3">
        <div className="w-full">
          <h3 className="text-sm mb-1">{card.title}</h3>
          <p className="text-neutral-700 mb-4 wrap-break-word">
            {card.description}
          </p>
        </div>

        <div className="flex gap-1 shrink-0">
          <Button
            icon={<MdDelete />}
            className="bg-red-600"
            onClick={() => card.deleteBoard(card.id)}
          />

          <Button
            icon={<HiOutlineIdentification />}
            className="bg-pink-600"
            onClick={() =>
              navigate(`/dashboard/organization/${card.orgId}/board/${card.id}`)
            }
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {card.members.length > 0 ? (
          card.members.map((m, i) => (
            <span key={i} className="px-2 py-1 bg-gray-200 rounded text-[11px]">
              {(m as any).username}
            </span>
          ))
        ) : (
          <span className="text-gray-500">No members</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-[11px] mb-3">
        <p>
          <span className="font-bold">Created by:</span> {card.createdBy}
        </p>
        <p>
          <span className="font-bold">On:</span> {card.createdAt}
        </p>
      </div>

      {isMemberCardOpen && (
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <Input
            type="email"
            placeholder="enter member email"
            inputRef={memberRef}
            className="w-full"
          />
          <Button
            className="bg-red-600"
            text="Cancel"
            onClick={() => setisMemberCardOpen(false)}
          />
        </div>
      )}

      <Button
        text="Add member"
        className="bg-amber-400 w-full"
        onClick={() => addMemberInBoard(card.id)}
      />
    </div>
  );
}
