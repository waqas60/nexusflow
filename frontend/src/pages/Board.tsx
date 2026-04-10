import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CardBoard from "../components/CardBoard";
import AddBoard from "../components/AddBoard";
import { ClipLoader } from "react-spinners";
import api from "../lib/axios";

export const Board = () => {
  const [isOpenAddboardBox, setIsOpenAddBoardBox] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const { orgId } = useParams();
  const [loading, setLoading] = useState(false);

  const getAllBoards = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/board/${orgId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = response.data;
      console.log(data.data);
      if (data.success) {
        setBoards(data.data);
      }
    } catch (error: any) {
      if (!error.response.data.success) {
      }
    } finally {
      setLoading(false);
    }
  };

  const addBoard = async () => {
    if (inputRef.current && descriptionRef.current) {
      try {
        const response = await api.post(
          `/api/board/${orgId}`,
          {
            title: inputRef.current.value,
            description: descriptionRef.current.value,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          },
        );

        const data = response.data;

        if (data.success) {
          await getAllBoards();
          toast.success(data.message);
        }
      } catch (error: any) {
        if (error.response.data.message === "incorrect input") {
          toast.error(
            error.response.data.data.map((obj: any) => obj.message).join(", "),
          );
        } else if (!error.response.data.success) {
          toast.error(error.response.data.message);
        }
      }
    }

    setIsOpenAddBoardBox(!isOpenAddboardBox);
  };

  useEffect(() => {
    getAllBoards();
  }, []);

  const deleteBoard = async (id: string) => {
    try {
      const response = await api.delete(`/api/board/${orgId}/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = response.data;
      console.log(data);

      if (data.success) {
        await getAllBoards();
        toast.success(data.message);
      }
    } catch (error: any) {
      console.log(error);
      if (!error.response.data.success) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="relative px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl mb-1">Boards</h1>
          <p className="text-xs text-neutral-500">Manage your boards</p>
        </div>

        <Button
          text="Add Board"
          className="w-full sm:w-auto"
          onClick={() => addBoard()}
        />
      </div>

      {isOpenAddboardBox && (
        <AddBoard
          titleRef={inputRef}
          descriptionRef={descriptionRef}
          setIsOpenAddOrgBox={setIsOpenAddBoardBox}
        />
      )}

      <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <ClipLoader color="#000" size={30} />
          </div>
        ) : boards.length === 0 ? (
          <div className="col-span-full flex justify-center items-center text-2xl sm:text-4xl font-bold text-neutral-300 h-40">
            No Boards
          </div>
        ) : (
          boards.map((card, index) => (
            <CardBoard
              key={index}
              {...card}
              getAllBoards={getAllBoards}
              deleteBoard={deleteBoard}
            />
          ))
        )}
      </div>
    </div>
  );
};
