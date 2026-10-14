import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Cpu,
  Globe2,
  LoaderCircle,
  LockKeyhole,
  Network,
  Save,
  Server,
  Trash2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  getProjectConfiguration,
  createProjectConfiguration,
  updateProjectConfiguration,
  deleteProjectConfiguration,
} from "@/api/api";

const EMPTY_FORM = {
  ipAddress: "",
  ipPassword: "",
  deviceId: "",
  targetPort: "",
  corsOrigin: "http://localhost:5173",
};

const inputClass =
  "h-10 rounded-lg border-white/10 bg-[#080e13] text-sm text-slate-100 placeholder:text-slate-600 shadow-none focus-visible:border-emerald-400/50 focus-visible:ring-2 focus-visible:ring-emerald-400/15";

const unwrap = (response) => {
  const body = response?.data?.data ? response.data : response;

  return {
    success: body?.success === true,
    data: body?.data ?? {},
    message: body?.message ?? "",
  };
};

const isValidIp = (value) => {
  const ip = value.trim();
  const parts = ip.split(".");

  if (
    parts.length === 4 &&
    parts.every(
      (part) =>
        /^\d{1,3}$/.test(part) && Number(part) >= 0 && Number(part) <= 255,
    )
  ) {
    return true;
  }

  if (!ip.includes(":")) return false;

  try {
    return new URL(`http://[${ip}]/`).hostname.length > 0;
  } catch {
    return false;
  }
};

const validate = (form, configured) => {
  const errors = {};

  if (!form.ipAddress.trim()) {
    errors.ipAddress = "Server IP address is required.";
  } else if (!isValidIp(form.ipAddress)) {
    errors.ipAddress = "Enter a valid IPv4 or IPv6 address.";
  }

  if (form.deviceId.trim() !== "") {
    const id = Number(form.deviceId);

    if (!Number.isInteger(id) || id < 0 || id > 4194303) {
      errors.deviceId = "Device ID must be between 0 and 4194303.";
    }
  }

  if (form.targetPort.trim() !== "") {
    const port = Number(form.targetPort);

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      errors.targetPort = "Port must be between 1 and 65535.";
    }
  }

  if (!configured && !form.ipPassword.trim()) {
    errors.ipPassword = "Password is required for initial setup.";
  }

  try {
    const rawOrigin = form.corsOrigin.trim();
    const url = new URL(rawOrigin);
    const normalized = rawOrigin.replace(/\/$/, "");

    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.origin !== normalized ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      errors.corsOrigin =
        "Enter an exact origin, e.g. https://app.example.com:5173.";
    }
  } catch {
    errors.corsOrigin = "Enter a valid origin, e.g. http://localhost:5173.";
  }

  return errors;
};

const FieldRow = ({ id, label, description, error, children }) => {
  return (
    <div className="grid gap-2 border-b border-white/[0.06] px-4 py-4 last:border-b-0 sm:grid-cols-[minmax(145px,0.75fr)_minmax(0,1.25fr)] sm:items-start sm:gap-5 sm:px-5">
      <div className="space-y-1">
        <Label htmlFor={id} className="text-[13px] font-medium text-slate-200">
          {label}
        </Label>

        {description && (
          <p className="text-xs leading-5 text-slate-500">{description}</p>
        )}
      </div>

      <div className="min-w-0 space-y-1.5">
        {children}

        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    </div>
  );
};

const Section = ({ icon: Icon, title, description, children }) => {
  return (
    <section className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a1015]">
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3.5 sm:px-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300">
          <Icon size={16} />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">{title}</h3>

          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
      </div>

      <div>{children}</div>
    </section>
  );
};

const Notice = ({ type = "error", children }) => {
  if (!children) return null;

  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${
        isSuccess
          ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300"
          : "border-rose-400/20 bg-rose-400/[0.06] text-rose-300"
      }`}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
};

const ServerConfigurationModal = ({ open, onOpenChange, onSaved }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [configured, setConfigured] = useState(false);
  const [passwordConfigured, setPasswordConfigured] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!open) return undefined;

    let active = true;

    const loadSettings = async () => {
      setLoading(true);
      setFeedback(null);
      setErrors({});
      setConfirmDelete(false);

      try {
        const result = unwrap(await getProjectConfiguration());

        if (!result.success) {
          throw new Error(result.message || "Unable to load settings.");
        }

        if (!active) return;

        const data = result.data;

        setConfigured(Boolean(data.configured));
        setPasswordConfigured(Boolean(data.ipPasswordConfigured));
        setUpdatedAt(data.updatedAt ?? null);

        setForm({
          ipAddress:
            data.ipAddress ??
            data.aurora?.serverIpAddress ??
            data.bacnet?.targetIp ??
            "",
          ipPassword: "",
          deviceId: data.deviceId ?? data.bacnet?.targetDeviceId ?? "",
          targetPort: data.targetPort ?? data.bacnet?.targetPort ?? "",
          corsOrigin:
            data.corsOrigin ?? data.allowedOrigin ?? "http://localhost:5173",
        });
      } catch (error) {
        if (active) {
          setFeedback({
            type: "error",
            message: error.message || "Unable to load settings.",
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSettings();

    return () => {
      active = false;
    };
  }, [open]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });

    setFeedback(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const nextErrors = validate(form, configured);

    setErrors(nextErrors);
    setFeedback(null);

    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);

    try {
      const payload = {
        ipAddress: form.ipAddress.trim(),
        deviceId: form.deviceId.trim() === "" ? null : Number(form.deviceId),
        targetPort:
          form.targetPort.trim() === "" ? null : Number(form.targetPort),
        corsOrigin: form.corsOrigin.trim().replace(/\/$/, ""),
      };

      // Password is sent only during initial configuration.
      if (!configured) {
        payload.ipPassword = form.ipPassword;
      }

      const response = configured
        ? await updateProjectConfiguration(payload)
        : await createProjectConfiguration(payload);

      const result = unwrap(response);

      if (!result.success) {
        throw new Error(result.message || "Unable to save settings.");
      }

      const saved = result.data ?? {};

      setConfigured(
        typeof saved.configured === "boolean" ? saved.configured : true,
      );

      setPasswordConfigured(
        typeof saved.ipPasswordConfigured === "boolean"
          ? saved.ipPasswordConfigured
          : passwordConfigured || Boolean(form.ipPassword),
      );

      setUpdatedAt(saved.updatedAt ?? new Date().toISOString());

      setForm((current) => ({
        ...current,
        ipPassword: "",
      }));

      onSaved?.(saved);

      // Close the modal only after a successful save.
      onOpenChange(false);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Unable to save settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setFeedback(null);

    try {
      const result = unwrap(await deleteProjectConfiguration());

      if (!result.success) {
        throw new Error(result.message || "Unable to clear configuration.");
      }

      setForm(EMPTY_FORM);
      setConfigured(false);
      setPasswordConfigured(false);
      setUpdatedAt(null);
      setConfirmDelete(false);

      onSaved?.(null);
      onOpenChange(false);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Unable to clear settings.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const closeModal = (nextOpen) => {
    if (saving || deleting) return;

    if (!nextOpen) {
      setConfirmDelete(false);
    }

    onOpenChange(nextOpen);
  };

  const busy = saving || deleting || loading;

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="flex max-h-[92dvh] w-[calc(100%-1rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1116] p-0 text-slate-100 shadow-2xl shadow-black/50 sm:w-full">
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300">
              <Server size={19} />
            </div>

            <DialogHeader className="space-y-1 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-lg font-semibold tracking-tight text-white">
                  Server configuration
                </DialogTitle>

                {!loading && (
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      configured
                        ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300"
                        : "border-orange-400/20 bg-orange-400/[0.07] text-orange-300"
                    }`}
                  >
                    {configured ? "Active" : "Setup needed"}
                  </span>
                )}
              </div>

              <DialogDescription className="max-w-lg text-sm leading-5 text-slate-400">
                Configure the server connection and network settings. Saved
                passwords are never displayed.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {loading ? (
            <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-slate-400">
              <LoaderCircle
                size={18}
                className="animate-spin text-emerald-300"
              />
              Loading configuration…
            </div>
          ) : (
            <form
              id="server-configuration-form"
              onSubmit={handleSave}
              className="space-y-4"
            >
              <Notice type={feedback?.type}>{feedback?.message}</Notice>

              <Section
                icon={Network}
                title="Connection"
                description="Server address and credentials"
              >
                <FieldRow
                  id="server-ip"
                  label="Server IP address"
                  description="IPv4 or IPv6 address"
                  error={errors.ipAddress}
                >
                  <Input
                    id="server-ip"
                    className={inputClass}
                    value={form.ipAddress}
                    onChange={(event) =>
                      updateField("ipAddress", event.target.value)
                    }
                    placeholder="192.168.1.100"
                    autoComplete="off"
                    disabled={busy}
                  />
                </FieldRow>

                {!configured && (
                  <FieldRow
                    id="server-password"
                    label="Server password"
                    description="Required for initial connection setup"
                    error={errors.ipPassword}
                  >
                    <div className="relative">
                      <LockKeyhole
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <Input
                        id="server-password"
                        type="password"
                        className={`${inputClass} pl-9`}
                        value={form.ipPassword}
                        onChange={(event) =>
                          updateField("ipPassword", event.target.value)
                        }
                        placeholder="Enter server password"
                        autoComplete="new-password"
                        disabled={busy}
                      />
                    </div>
                  </FieldRow>
                )}

                {configured && (
                  <div className="flex items-center gap-2 px-4 py-3.5 text-xs text-slate-400 sm:px-5">
                    <LockKeyhole size={14} className="text-emerald-300" />
                    <span>
                      {passwordConfigured
                        ? "Password is securely configured"
                        : "No saved password reported by server"}
                    </span>
                  </div>
                )}
              </Section>

              <Section
                icon={Cpu}
                title="BACnet target"
                description="Device identifier and remote port"
              >
                <FieldRow
                  id="bacnet-device-id"
                  label="Device ID"
                  description="Integer from 0 to 4194303"
                  error={errors.deviceId}
                >
                  <Input
                    id="bacnet-device-id"
                    type="number"
                    min={0}
                    max={4194303}
                    step={1}
                    className={inputClass}
                    value={form.deviceId}
                    onChange={(event) =>
                      updateField("deviceId", event.target.value)
                    }
                    placeholder="1234"
                    disabled={busy}
                  />
                </FieldRow>

                <FieldRow
                  id="bacnet-target-port"
                  label="Target port"
                  description="Remote BACnet port (1–65535)"
                  error={errors.targetPort}
                >
                  <Input
                    id="bacnet-target-port"
                    type="number"
                    min={1}
                    max={65535}
                    step={1}
                    className={inputClass}
                    value={form.targetPort}
                    onChange={(event) =>
                      updateField("targetPort", event.target.value)
                    }
                    placeholder="47808"
                    disabled={busy}
                  />
                </FieldRow>

                <p className="px-4 py-3 text-xs text-slate-500 sm:px-5">
                  Local BACnet port is managed by the server and cannot be
                  edited here.
                </p>
              </Section>

              <Section
                icon={Globe2}
                title="Allowed origin"
                description="Frontend origin permitted by CORS"
              >
                <FieldRow
                  id="cors-origin"
                  label="Frontend URL"
                  description="Exact origin only; no path or query"
                  error={errors.corsOrigin}
                >
                  <Input
                    id="cors-origin"
                    className={inputClass}
                    value={form.corsOrigin}
                    onChange={(event) =>
                      updateField("corsOrigin", event.target.value)
                    }
                    placeholder="http://localhost:5173"
                    autoComplete="url"
                    disabled={busy}
                  />
                </FieldRow>
              </Section>

              {updatedAt && (
                <p className="px-1 text-[11px] text-slate-500">
                  Last updated:{" "}
                  {Number.isNaN(Date.parse(updatedAt))
                    ? updatedAt
                    : new Date(updatedAt).toLocaleString()}
                </p>
              )}
            </form>
          )}
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-white/[0.08] bg-[#080e13] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {confirmDelete ? (
            <>
              <p className="text-sm text-orange-200">
                Clear the saved server and BACnet connection settings?
              </p>

              <div className="flex gap-2 sm:shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07] hover:text-white"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-rose-500 text-white hover:bg-rose-400"
                >
                  {deleting ? (
                    <LoaderCircle size={15} className="mr-2 animate-spin" />
                  ) : (
                    <Trash2 size={15} className="mr-2" />
                  )}

                  {deleting ? "Clearing…" : "Confirm clear"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                {configured ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setConfirmDelete(true)}
                    disabled={busy}
                    className="justify-start px-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"
                  >
                    <Trash2 size={15} className="mr-2" />
                    Clear settings
                  </Button>
                ) : (
                  <span className="text-xs text-slate-500">
                    Complete the required fields to continue.
                  </span>
                )}
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => closeModal(false)}
                  disabled={saving || deleting}
                  className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07] hover:text-white"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  form="server-configuration-form"
                  disabled={busy}
                  className="bg-emerald-400 font-semibold text-[#07100b] hover:bg-emerald-300"
                >
                  {saving ? (
                    <LoaderCircle size={16} className="mr-2 animate-spin" />
                  ) : (
                    <Save size={16} className="mr-2" />
                  )}

                  {saving
                    ? "Saving…"
                    : configured
                      ? "Save changes"
                      : "Add configuration"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServerConfigurationModal;
