import React, { useRef, useState } from "react";
import Button from "./Button";
import { MdDelete } from "react-icons/md";
import Input from "./Input";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export type CardComponentProp = {
  id: string;
  title: string;
  description: string;
  status: "not_taken" | "pending" | "done";
  difficulty: "easy" | "medium" | "hard";
  boardId: string;
  orgId: string;
  createdAt: string;
  assignedTo: string;
  getCards: () => Promise<void>;
};

export default function CardComponent(card: CardComponentProp) {
  const memberRef = useRef<HTMLInputElement>(null);
  const [isMemberCardOpen, setisMemberCardOpen] = useState(false);
  const { orgId, boardId } = useParams();

  const difficultyColor = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700",
  };

  const statusColor = {
    not_taken: "bg-gray-100 text-gray-500",
    pending: "bg-blue-100 text-blue-600",
    done: "bg-emerald-100 text-emerald-700",
  };

  const assignedTask = async () => {
    setisMemberCardOpen(true);
    if (memberRef.current) {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/card/${orgId}/${boardId}/${card.id}/members`,
          { email: memberRef.current.value },
          { headers: { Authorization: localStorage.getItem("token") } },
        );
        const data = response.data;
        if (data.success) {
          card.getCards();
          setisMemberCardOpen(false);
        }
      } catch (error) {
        console.log(error);
        setisMemberCardOpen(false);
        if (!error.response.data.success) {
          await card.getCards();
          toast.error(error.response.data.message);
        }
      }
    }
  };

  const deleteCard = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/card/${orgId}/${boardId}/${card.id}`,
        { headers: { Authorization: localStorage.getItem("token") } },
      );
      const data = response.data;
      if (data.success) {
        await card.getCards();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      if (!error.response.data.success) {
        await card.getCards();
        toast.error(error.response.data.message);
      }
    }
  };

  const takeTask = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/card/${orgId}/board/${boardId}/task/${card.id}/take`,
        {},
        { headers: { Authorization: localStorage.getItem("token") } },
      );
      if (res.data.success) {
        toast.success("Task taken!");
        await card.getCards();
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const updateStatus = async (status: "pending" | "done") => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/card/${orgId}/board/${boardId}/task/${card.id}/status`,
        { status },
        { headers: { Authorization: localStorage.getItem("token") } },
      );
      if (res.data.success) {
        toast.success(`Marked as ${status}`);
        await card.getCards();
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col gap-1 my-1 relative">
      <div>
        <h1 className="text-md font-medium text-neutral-950">{card.title}</h1>
        <p className="text-neutral-500 my-3">{card.description}</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-4">
          <div className="flex gap-5">
            <span
              className={`px-2 py-1 rounded-md font-medium ${statusColor[card.status]}`}
            >
              {card.status}
            </span>
            <span
              className={`px-2 py-1 rounded-md font-medium ${difficultyColor[card.difficulty]}`}
            >
              {card.difficulty}
            </span>
          </div>
          
        </div>

        <div className="flex gap-1 shrink-0 h-fit absolute top-3 right-2">
          <Button
            className="bg-red-600 shrink-0"
            icon={<MdDelete />}
            onClick={deleteCard}
          />
        </div>
      </div>

      
      {card.status === "not_taken" && (
        <>
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
          <div className="flex gap-2">
            <Button
              text="Assign To"
              className="w-fit text-xs bg-neutral-900"
              onClick={() => assignedTask()}
            />
            <Button
              text="Take Task"
              className="w-fit text-xs bg-blue-600"
              onClick={takeTask}
            />
          </div>
        </>
      )}

      
      {card.status === "pending" && card.assignedTo && (
        <div className="flex flex-col gap-1 my-2">
          <p className="text-xs text-gray-400">
            Assigned to: {card.assignedTo}
          </p>
          <button
            onClick={() => updateStatus("done")}
            className="bg-green-500 text-white text-xs px-3 py-1 rounded w-fit"
          >
            Mark as Done
          </button>
        </div>
      )}

      
      {card.status === "done" && (
        <span className="text-emerald-600 text-xs font-medium">
          ✓ Completed
        </span>
      )}
    </div>
  );
}
