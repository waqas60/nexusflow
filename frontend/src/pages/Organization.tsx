import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import AddOrganization from "../components/AddOrganization";
import { toast } from "react-toastify";
import CardOrg from "../components/CardOrg";
import { ClipLoader } from "react-spinners";
import api from "../lib/axios";

export const Organization = () => {
  const [isOpenAddOrgBox, setIsOpenAddOrgBox] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllOrgs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/organization", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = response.data;

      if (data.success) {
        setOrgs(data.data);
      }
    } catch (error: any) {
      if (!error.response?.data?.success) {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const addOrg = async () => {
    if (inputRef.current && descriptionRef.current) {
      try {
        const response = await api.post(
          "/api/organization",
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
          await getAllOrgs(); 
          toast.success(data.message);
        }
      } catch (error: any) {
        if (error.response?.data?.message === "incorrect input") {
          toast.error(
            error.response.data.data.map((obj: any) => obj.message).join(", "),
          );
        } else if (!error.response?.data?.success) {
          toast.error(error.response.data.message);
        }
      }
    }

    setIsOpenAddOrgBox(!isOpenAddOrgBox);
  };

  useEffect(() => {
    getAllOrgs();
  }, []);

  const deleteOrg = async (id: string) => {
    try {
      const response = await api.delete(`/api/organization/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const data = response.data;

      if (data.success) {
        await getAllOrgs(); 
        toast.success(data.message);
      }
    } catch (error: any) {
      console.log(error);
      if (!error.response?.data?.success) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="relative px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl mb-1">Organizations</h1>
          <p className="text-xs text-neutral-500">Manage your organizations</p>
        </div>

        <Button
          text="Add Organization"
          onClick={() => setIsOpenAddOrgBox(true)} 
          className="w-full sm:w-auto"
        />
      </div>

      {isOpenAddOrgBox && (
        <AddOrganization
          titleRef={inputRef}
          descriptionRef={descriptionRef}
          setIsOpenAddOrgBox={setIsOpenAddOrgBox}
          addOrg={addOrg}
        />
      )}

      <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <ClipLoader color="#000" size={30} />
          </div>
        ) : orgs.length === 0 ? (
          <div className="col-span-full flex justify-center items-center text-2xl sm:text-4xl font-bold text-neutral-300 h-40">
            No Orgs
          </div>
        ) : (
          orgs.map((card, index) => (
            <CardOrg
              key={index}
              {...card}
              getAllOrgs={getAllOrgs}
              deleteOrg={deleteOrg}
            />
          ))
        )}
      </div>
    </div>
  );
};
