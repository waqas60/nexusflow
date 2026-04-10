import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-10 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.05] mb-6 max-w-4xl mx-auto">
          Organize work.
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-violet-500">
            Ship faster.
          </span>
        </h1>
        <p className="text-[17px] text-slate-500 max-w-xl mx-auto leading-relaxed mb-10">
          NexusFlow keeps your team's work structured, visible, and moving
          without the noise.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            className="w-full sm:w-auto text-[14px] font-semibold text-white bg-neutral-950 border border-slate-200 px-8 py-3.5 rounded-2xl hover:border-slate-400 transition-all cursor-pointer"
            onClick={() => navigate("/dashboard/organization")}
          >
            Get Started
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/60">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full"
          >
            <source
              src="https://res.cloudinary.com/doxl2zlcx/video/upload/q_auto,f_auto/nexusflow_ikri73.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>
    </div>
  );
}
