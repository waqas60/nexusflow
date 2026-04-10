import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import { useParams } from "react-router-dom";
import AddCard from "../components/AddCard";
import CardComponent from "../components/CardComponent";
import { toast } from "react-toastify";
import api from "../lib/axios";

const columnsColors = {
  "Not Taken": "bg-indigo-200",
  Pending: "bg-orange-100",
  Done: "bg-green-100 ",
};

export const Card = () => {
  const [isOpenAddCardBox, setIsOpenAddCardBox] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const difficultyRef = useRef<HTMLSelectElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);
  const [cards, setCards] = useState([]);
  const { orgId, boardId } = useParams();
  const notTakenTasks = cards.filter((c) => c.status === "not_taken");
  const pendingTasks = cards.filter((c) => c.status === "pending");
  const doneTasks = cards.filter((c) => c.status === "done");
  const columns = [
    { label: "Not Taken", tasks: notTakenTasks },
    { label: "Pending", tasks: pendingTasks },
    { label: "Done", tasks: doneTasks },
  ];

  const addCard = async () => {
    setIsOpenAddCardBox(true);
    if (
      inputRef.current &&
      descriptionRef.current &&
      difficultyRef.current &&
      statusRef.current
    ) {
      try {
        const response = await api.post(
          `api/card/${orgId}/${boardId}`,
          {
            title: inputRef.current.value,
            description: descriptionRef.current.value,
            difficulty: difficultyRef.current.value,
            status: statusRef.current.value,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          },
        );
        const data = response.data;
        if (data.success) {
          setIsOpenAddCardBox(false);
          getCards();
        }
      } catch (error) {
        console.log(error);
        if (!error.response.data.success) {
          toast.error(error.response.data.message);
        }
      }
    }
  };

  const getCards = async () => {
    console.log("orgId:", orgId, "boardId:", boardId); 

    try {
      const response = await api.get(
        `/api/card/${orgId}/${boardId}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        },
      );
      const data = response.data;
      if (data.success) {
        setCards(data.data);
      } else {
        setCards([]);
      }
    } catch (error) {
      console.log(error);
      if (!error.response.data.success) {
      }
    }
  };

  useEffect(() => {
    getCards();
  }, []);

  return (
    <div className="relative bg-white rounded-lg h-full ">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl mb-2">Cards</h1>
          <p className="text-xs">Manage your cards</p>
        </div>
        <Button text="Add Card" onClick={() => addCard()} />
      </div>

      {isOpenAddCardBox && (
        <AddCard
          titleRef={inputRef}
          descriptionRef={descriptionRef}
          difficultyRef={difficultyRef}
          statusRef={statusRef}
          setIsOpenAddCardBox={setIsOpenAddCardBox}
        />
      )}

      <div className="grid w-full grid-cols-3 gap-2 my-8 text-xs">
        {columns.map((col) => (
          <div
            className={`${columnsColors[col.label]} bg-gray-200 w-full p-3 rounded-md max-h-fit `}
          >
            <h1>{col.label}</h1>

            {col.tasks.map((task) => (
              <CardComponent
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                status={task.status}
                difficulty={task.difficulty}
                assignedTo={task.assignedTo}
                boardId={task.boardId}
                orgId={orgId}
                createdAt={task.createdAt}
                getCards={getCards}
              />
            ))}
          </div>
        ))}

        {cards.length === 0 && (
          <div className="col-span-3 w-full flex justify-center items-center text-4xl font-bold text-neutral-300 h-40">
            No Card
          </div>
        )}
      </div>
    </div>
  );
};
