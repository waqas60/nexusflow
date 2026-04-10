import React, { useRef, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { HiOutlineViewBoards } from "react-icons/hi";
import api from "../lib/axios";

type CardProp = {
  id: string;
  title: string;
  description: string;
  members: string[];
  createdAt: string;
  createdBy: string;
  getAllOrgs: () => Promise<void>;
  deleteOrg: (id: string, e: React.MouseEvent) => Promise<void>;
};

export default function CardOrg(card: CardProp) {
  const memberRef = useRef<HTMLInputElement>(null);
  const [isMemberCardOpen, setisMemberCardOpen] = useState(false);
  const navigate = useNavigate();
  const handleGoToBoards = () => {
    navigate(`/dashboard/organization/${card.id}/board`);
  };

  const addMemberInOrg = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setisMemberCardOpen(true);
    if (memberRef.current) {
      try {
        const response = await api.post(
          `/api/organization/${card.id}/members`,
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
          await card.getAllOrgs();
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
    <div className="p-4 rounded-2xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] w-full hover:scale-[1.02] duration-300">
      <div
        className="flex justify-between items-start gap-3"
        onClick={handleGoToBoards}
      >
        <div className="w-full">
          <h3 className="text-md mb-1">{card.title}</h3>
          <p className="text-xs text-neutral-600 mb-4 sm:mb-8">
            {card.description}
          </p>
        </div>

        <div className="flex gap-1 shrink-0">
          <Button
            className="bg-red-600"
            icon={<MdDelete />}
            onClick={(e) => card.deleteOrg(card.id, e)}
          />
          <Button
            icon={<HiOutlineViewBoards />}
            className="bg-pink-600"
            onClick={() => navigate(`/dashboard/organization/${card.id}/board`)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {card.members.map((member, index) => (
          <div
            key={index}
            className="text-xs bg-neutral-950 text-white px-2 py-1 rounded-full"
          >
            {member}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-col sm:flex-row sm:justify-between text-xs gap-1">
        <p>
          <span className="font-bold">Created by:</span> {card.createdBy}
        </p>
        <p>
          <span className="font-bold">On:</span> {card.createdAt}
        </p>
      </div>

      {isMemberCardOpen && (
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <Input
            type="email"
            placeholder="enter member email"
            inputRef={memberRef}
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
        className="bg-amber-400 mt-3"
        onClick={(e) => addMemberInOrg(e)}
      />
    </div>
  );
}
