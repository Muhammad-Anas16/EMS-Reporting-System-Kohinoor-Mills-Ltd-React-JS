import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router";
import { LogoutUser } from "@/api/api";
import AuroraData from "@/api/filter/getauroraData";

const Navbar = ({ userData = "user" }) => {
  const navigate = useNavigate();

  const [data, setData] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const result = async () => {
      const res = await AuroraData("dyeing");
      console.log("My => ", res);
    };
    result();
  }, []);

  const handleAdminPanel = () => {
    setDropdownOpen(false);
    navigate("/admin");
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setDropdownOpen(false);

    try {
      await LogoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      sessionStorage.clear();
      window.location.reload();
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="w-full border-b border-white/5 bg-[#070c11]">
      <div className="flex min-h-[76px] w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Greeting */}
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight text-white sm:text-lg">
            Energy Management
          </h1>

          <p className="mt-0.5 truncate text-[10px] text-slate-400 sm:text-[11px]">
            Here's what's happening with your energy today.
          </p>
        </div>

        {/* Right: Date, status and dropdown */}
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

          <div className="hidden h-8 w-px bg-white/10 sm:block" />

          {/* System Status */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />

            <span className="text-[10px] font-medium text-slate-200 sm:text-[11px]">
              System Online
            </span>
          </div>

          {/* Profile Dropdown */}

          <div className="relative cursor-pointer " ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07] cursor-pointer "
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                <UserRound size={16} />
              </span>

              <span className="hidden text-sm font-medium sm:block">
                Account
              </span>

              <ChevronDown
                size={15}
                className={`text-slate-400 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#0b1219] p-1.5 shadow-xl shadow-black/40"
              >
                {userData?.role !== "user" && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleAdminPanel}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/[0.07] hover:text-white cursor-pointer "
                  >
                    <LayoutDashboard size={17} className="text-cyan-400" />

                    <span>Admin Panel</span>
                  </button>
                )}

                <div className="my-1 border-t border-white/10" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer "
                >
                  <LogOut size={17} />

                  <span>{loggingOut ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
