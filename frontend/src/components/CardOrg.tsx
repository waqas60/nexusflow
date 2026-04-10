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
      } catch (error) {
        if (!error.response.data.success) {
          toast.error(error.response.data.message);
        }
      }
    }
  };

  return (
    <div className="p-4 rounded-2xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] min-w-90  cursor-pointer hover:scale-102 duration-300">
      <div
        className="flex justify-between items-center relative"
        onClick={() => handleGoToBoards()}
      >
        <div>
          <h3 className="text-md mb-2">{card.title}</h3>
          <p className="text-xs mb-8 max-w-80 mt-6">{card.description}</p>
        </div>
        <div className="absolute top-0 right-0 flex">
          <Button
            className="shrink-0 self-start mt-2 bg-red-600 mr-1"
            icon={<MdDelete />}
            onClick={(e) => {
              card.deleteOrg(card.id, e);
            }}
          />
          <div className="relative group">
            <Button
              icon={<HiOutlineViewBoards />}
              className="shrink-0 self-start mt-2 bg-pink-600"
              onClick={() => navigate(`/organization/${card.id}/board`)}
            />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Boards
            </span>
          </div>
        </div>
      </div>

      <div className="mb-1 fles items-center gap-3 flex">
        {card.members.map((member, index) => (
          <div
            key={index}
            className="text-xs bg-neutral-950 text-white p-1 mb-2 rounded-full select-none"
          >
            {member}
          </div>
        ))}
      </div>

      <div className="mb-2 flex justify-between text-xs">
        <p>
          <span className="font-bold">Created by:</span>
          {card.createdBy}
        </p>
        <p>
          <span className="font-bold">On: </span>
          {card.createdAt}
        </p>
      </div>

      <div>
        {isMemberCardOpen && (
          <div className="flex gap-1 items-center">
            <Input
              type="email"
              placeholder="enter member email"
              inputRef={memberRef}
              className="my-4 w-full"
            />
            <Button
              className="bg-red-600 shrink-0"
              text="Cancel"
              onClick={() => setisMemberCardOpen(false)}
            />
          </div>
        )}
        <Button
          text="Add member"
          className="bg-amber-400"
          onClick={(e) => {
            addMemberInOrg(e);
          }}
        />
      </div>
    </div>
  );
}
