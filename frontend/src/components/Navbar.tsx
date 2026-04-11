import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    toast.success("You've been logged out", { autoClose: 2000 });
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#f8f7f4]/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            nexusflow
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          <p
            className="text-sm hover:text-neutral-600 transition cursor-pointer hidden sm:block"
            onClick={() => navigate("/dashboard/organization")}
          >
            Organization
          </p>

          {username && (
            <Button
              text="Logout"
              className="bg-red-600 font-bold"
              onClick={() => logout()}
            />
          )}

          {username ? (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 text-white text-xs sm:text-[13px] font-bold flex items-center justify-center">
              {username.charAt(0).toUpperCase()}
            </div>
          ) : (
            <Button text="Login" onClick={() => navigate("/login")} />
          )}
        </div>
      </div>
    </nav>
  );
}
