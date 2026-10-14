import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  LoaderCircle,
  Network,
  RefreshCw,
  Server,
  Settings2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getProjectConfiguration } from "@/api/api";
import ServerConfigurationModal from "./ServerConfigurationModal";

function getPayload(response) {
  const body = response?.data?.data ? response.data : response;

  return {
    success: body?.success === true,
    data: body?.data ?? {},
    message: body?.message ?? "",
  };
}

const ServerConfigurationCard = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getProjectConfiguration();
      const result = getPayload(response);

      if (!result.success) {
        throw new Error(result.message || "Settings load nahi ho sakin.");
      }

      setSettings(result.data);
    } catch (err) {
      setError(err.message || "Server configuration load nahi ho saki.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const configured = Boolean(settings?.configured);
  const serverIp =
    settings?.ipAddress ??
    settings?.aurora?.serverIpAddress ??
    settings?.bacnet?.targetIp ??
    "";

  const deviceId = settings?.deviceId ?? settings?.bacnet?.targetDeviceId;

  const targetPort = settings?.targetPort ?? settings?.bacnet?.targetPort;

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b1116] text-slate-100 shadow-xl shadow-black/10">
        <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-cyan-400/[0.06] blur-3xl" />

        <div className="relative flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-300">
              <Server size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                  Server Configuration
                </h2>

                {!loading && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-medium ${
                      configured
                        ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300"
                        : "border-amber-400/20 bg-amber-400/[0.07] text-amber-300"
                    }`}
                  >
                    {configured ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <AlertCircle size={12} />
                    )}
                    {configured ? "Configured" : "Setup required"}
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Manage server connection, BACnet target aur CORS allowed origin.
              </p>
            </div>

            <button
              type="button"
              onClick={loadSettings}
              disabled={loading}
              aria-label="Refresh server configuration"
              className="rounded-lg border border-white/[0.08] p-2 text-slate-400 transition hover:bg-white/[0.05] hover:text-cyan-300 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <RefreshCw size={17} />
              )}
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-3 text-sm text-rose-300"
            >
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                <Network size={14} />
                Server IP
              </div>
              <p className="break-all font-mono text-sm text-slate-200">
                {loading ? "Loading..." : serverIp || "Not configured"}
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                <Settings2 size={14} />
                Device ID
              </div>
              <p className="font-mono text-sm text-slate-200">
                {loading ? "Loading..." : (deviceId ?? "Not set")}
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                <Network size={14} />
                Target port
              </div>
              <p className="font-mono text-sm text-slate-200">
                {loading ? "Loading..." : (targetPort ?? "Not set")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/[0.07] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">
              {configured
                ? "Configuration saved hai. Edit karne ke liye modal open karein."
                : "Server ko connect karne se pehle configuration complete karein."}
            </p>

            <Button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full bg-cyan-400 font-semibold text-slate-950 hover:bg-cyan-300 sm:w-auto cursor-pointer"
            >
              <Settings2 size={16} className="mr-2" />
              {configured ? "Edit configuration" : "Configure server"}
              <ArrowUpRight size={15} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <ServerConfigurationModal
        open={open}
        onOpenChange={setOpen}
        onSaved={loadSettings}
      />
    </>
  );
};

export default ServerConfigurationCard;
