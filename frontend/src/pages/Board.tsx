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
  const [boards, setBoards] = useState([]);
  const { orgId } = useParams();
  const [loading, setLoading] = useState(false);

  const getAllBoards = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/board/${orgId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      );
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
            error.response.data.data.map((obj) => obj.message).join(", "),
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
      const response = await api.delete(
        `/api/board/${orgId}/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      );
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
    <div className="relative  ">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl mb-2">Boards</h1>
          <p className="text-xs">Manage your boards</p>
        </div>
        <Button text="Add Board" onClick={() => addBoard()} />
      </div>

      
      {isOpenAddboardBox && (
        <AddBoard
          titleRef={inputRef}
          descriptionRef={descriptionRef}
          setIsOpenAddOrgBox={setIsOpenAddBoardBox}
        />
      )}

      
      <div className="mt-10 flex gap-5 flex-wrap">
        {loading ? (
          <div className="flex justify-center items-center mx-auto">
            <ClipLoader color="#000" size={30} />
          </div>
        ) : (
          <div className="mt-1 flex gap-5 flex-wrap">
            {boards.map((card, index) => (
              <CardBoard
                key={index}
                id={card.id}
                orgId={card.orgId}
                title={card.title}
                description={card.description}
                members={card.members}
                createdAt={card.createdAt}
                createdBy={card.createdBy}
                getAllBoards={getAllBoards}
                deleteBoard={deleteBoard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
