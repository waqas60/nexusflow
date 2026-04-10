import { useRef, useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import axios from "axios";
import { FaEyeSlash } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { toast } from "react-toastify";

export default function SignUp() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) return;
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signin",
        {
          email: emailRef.current.value,
          password: passwordRef.current.value,
        },
      );
      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("username", data.data.username);
        setTimeout(() => navigate("/dashboard/organization"), 2000);
      }
    } catch (error) {
      if (!error.response.data.success) {
        const data = error.response.data;
        if (Array.isArray(data.data))
          toast.error(
            error.response.data.data.map((d) => d.message).join("\n"),
          );
        else toast.error(data.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#e2e0db 1px, transparent 1px), linear-gradient(90deg, #e2e0db 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          opacity: 0.45,
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-[22px] font-black tracking-tight text-slate-900">
            nexusflow
          </h1>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 p-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                Email
              </label>
              <Input
                type="email"
                inputRef={emailRef}
                placeholder="franky@gmail.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="flex">
                <Input
                  type={showPass ? "text" : "password"}
                  inputRef={passwordRef}
                  placeholder="••••••••"
                />
                <button onClick={() => setShowPass(!showPass)} className="">
                  {showPass ? <IoEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <Button text="Login" onClick={handleSubmit} />
          </div>
          <p className="text-center text-[13px] text-slate-400 mt-6">
            Already have an account?{" "}
            <button
              className="text-slate-700 font-semibold hover:text-slate-900 transition-colors underline underline-offset-2"
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
