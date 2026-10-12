import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

const Navbar = () => {
  const [data, setData] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full border-b border-white/5 bg-[#070c11]">
      <div className="flex min-h-[76px] w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Greeting */}
        <div className="min-w-0">
          <h1 className="truncate capitalize text-base font-semibold tracking-tight text-white sm:text-lg">
            Energy MAnagement
          </h1>

          <p className="mt-0.5 truncate text-[10px] text-slate-400 sm:text-[11px]">
            Here's what's happening with your energy today.
          </p>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          {/* Date & Time */}
          <div className="hidden items-center gap-2 sm:flex">
            <CalendarDays
              size={15}
              strokeWidth={1.8}
              className="text-slate-400"
            />

            <div className="leading-tight">
              <p className="text-[10px] font-medium text-slate-300 sm:text-[11px]">
                {data.toDateString()}
              </p>
              <p className="mt-0.5 text-[9px] text-slate-500 sm:text-[10px]">
                {data.toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-white/10 sm:block" />

          {/* System Status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />

              <span className="text-[10px] font-medium text-slate-200 sm:text-[11px]">
                System Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
