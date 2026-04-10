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
  const [dataNotFound, setDataNotFound] = useState(false);

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
        if (data.data.length === 0) setDataNotFound(true);
      }
    } catch (error: any) {
      if (!error.response.data.success) {
      }
    } finally {
      setLoading(false);
    }
  };

  const addOrg = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
        if (error.response.data.message === "incorrect input") {
          console.log(error.response.data.data);

          toast.error(
            error.response.data.data.map((obj: any) => obj.message).join(", "),
          );
        } else if (!error.response.data.success) {
          toast.error(error.response.data.message);
        }
      }
    }

    setIsOpenAddOrgBox(!isOpenAddOrgBox);
  };

  useEffect(() => {
    getAllOrgs();
  }, []);

  const deleteOrg = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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
      if (!error.response.data.success) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="relative ">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl mb-2">Organizations</h1>
          <p className="text-xs">Manage your organizations</p>
        </div>
        <Button
          text="Add Organization"
          onClick={(e) => {
            addOrg(e);
          }}
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

      <div className="mt-10 flex gap-5 flex-wrap">
        {dataNotFound && (
          <p className="text-neutral-500 text-xl h-full mx-auto">No orgs</p>
        )}

        {loading ? (
          <div className="flex justify-center items-center mx-auto">
            <ClipLoader color="#000" size={30} />
          </div>
        ) : (
          <div className="mt-1 flex gap-5 flex-wrap">
            {orgs.map((card, index) => (
              <CardOrg
                key={index}
                id={card.id}
                title={card.title}
                description={card.description}
                members={card.members}
                createdAt={card.createdAt}
                createdBy={card.createdBy}
                getAllOrgs={getAllOrgs}
                deleteOrg={deleteOrg}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
