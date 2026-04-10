import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-10 text-center">
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-tight sm:leading-[1.05] mb-5 sm:mb-6 max-w-4xl mx-auto">
          Organize work.
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-violet-500">
            Ship faster.
          </span>
        </h1>

        <p className="text-sm sm:text-[17px] text-slate-500 max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2">
          NexusFlow keeps your team's work structured, visible, and moving
          without the noise.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            className="w-full sm:w-auto text-sm font-semibold text-white bg-neutral-950 px-6 sm:px-8 py-3.5 rounded-2xl hover:opacity-90 transition cursor-pointer"
            onClick={() => navigate("/dashboard/organization")}
          >
            Get Started
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl sm:shadow-2xl shadow-slate-200/60">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-auto"
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
