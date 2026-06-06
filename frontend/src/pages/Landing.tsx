import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-10 text-center">
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-tight sm:leading-[1.05] mb-5 sm:mb-6 max-w-4xl mx-auto">
          Organize work
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-violet-500">
            Ship faster
          </span>
        </h1>

        <p className="text-sm sm:text-[15px] text-slate-500 max-w-sm mx-auto leading-relaxed mb-8 sm:mb-10 px-2 ">
          NexusFlow keeps your teams work structured, visible and moving
          without the noise
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            className="cursor-pointer rounded-lg border border-neutral-600 bg-neutral-900 px-8 py-3 font-medium text-neutral-50 ring-2 ring-neutral-900 transition-all duration-700 ease-out hover:border-neutral-500 hover:shadow-[inset_0px_0px_20px_rgba(255,255,255,0.3)]"
            onClick={() => navigate("/dashboard/organization")}
          >
            Get Started
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 select-none">
        <div className=" overflow-hidden  shadow-xl sm:shadow-2xl shadow-slate-200/60 border border-neutral-300 rounded-2xl">
          {/* <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-auto rounded-xl"
          >
            <source
              src="https://res.cloudinary.com/doxl2zlcx/video/upload/q_auto,f_auto/nexusflow_ikri73.mp4"
              type="video/mp4"
            />
          </video> */}
          <img src="landing_image.png" className="" alt="NexusFlow" />
        </div>
      </section>
    </div>
  );
}
