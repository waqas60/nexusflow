import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  return (
    <nav className="sticky top-0 z-50 bg-[#f8f7f4]/90 backdrop-blur ">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            nexusflow
          </span>
        </div>
        <div className="flex items-center gap-8">
          <p
            className="text-sm hover:text-neutral-600 duration-300 transition-all cursor-pointer"
            onClick={() => navigate("/dashboard/organization")}
          >
            Organization
          </p>

          {username ? (
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white text-[13px] font-bold flex items-center justify-center">
              {username?.charAt(0).toUpperCase()}
            </div>
          ) : (
            <Button text="Login" onClick={() => navigate("/login")} />
          )}
        </div>
      </div>
    </nav>
  );
}
