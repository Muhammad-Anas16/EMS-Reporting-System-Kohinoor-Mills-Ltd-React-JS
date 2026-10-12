import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = yup
  .object({
    username: yup
      .string()
      .trim()
      .required("Username is required.")
      .min(3, "Username must be at least 3 characters."),

    password: yup
      .string()
      .required("Password is required.")
      .min(8, "Password must be at least 8 characters."),
  })
  .required();

const LoginDialog = ({ onLogin, triggerLabel = "Login", islogin = false }) => {
  const [open, setOpen] = useState(!islogin);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Keep dialog synchronized with the parent's login state.
  useEffect(() => {
    setOpen(!islogin);

    if (islogin) {
      reset();
      setShowPassword(false);
      setServerError("");
      setInfoMessage("");
    }
  }, [islogin, reset]);

  const handleOpenChange = (nextOpen) => {
    // Do not allow the dialog to close while logged out.
    if (!islogin && !nextOpen) {
      setOpen(true);
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      reset();
      setShowPassword(false);
      setServerError("");
      setInfoMessage("");
    }
  };

  const submitLogin = async (values) => {
    setServerError("");
    setInfoMessage("");

    if (typeof onLogin !== "function") {
      setInfoMessage("Login handler is not configured.");
      return;
    }

    try {
      const result = await onLogin(values);

      // Parent should update islogin to true after successful authentication.
      if (result?.success === false) {
        setServerError(result.message || "Invalid username or password.");
        return;
      }

      // Do not assume login succeeded just because onLogin returned.
      if (result?.success === true) {
        setOpen(false);
        reset();
        setShowPassword(false);
      }
    } catch (error) {
      setServerError(
        error instanceof Error && error.message
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    }
  };

  return (
    <>
      {/* Only show the manual login button when logged out.
          The dialog itself opens automatically. */}
      {!islogin && (
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="h-10 rounded-lg bg-cyan-500 px-5 font-semibold text-slate-950 hover:bg-cyan-400"
        >
          {triggerLabel}
        </Button>
      )}

      <Dialog open={!islogin && open} onOpenChange={handleOpenChange}>
        <DialogContent
          onEscapeKeyDown={(event) => {
            if (!islogin) event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (!islogin) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (!islogin) event.preventDefault();
          }}
          className="w-[calc(100%-2rem)] max-w-[420px] overflow-hidden rounded-2xl border border-white/15 bg-slate-950/50 p-0 text-slate-100 shadow-[0_0_60px_rgba(6,182,212,0.10)] backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-950/40 sm:rounded-2xl"
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />

          <div className="p-6 sm:p-8">
            <DialogHeader className="mb-7 text-left">
              <DialogTitle className="text-2xl font-bold tracking-tight text-white">
                Welcome
              </DialogTitle>

              <DialogDescription className="mt-2 text-sm leading-6 text-slate-300">
                Sign in to access the dashboard.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(submitLogin)}
              noValidate
              className="space-y-5"
            >
              {/* Username */}
              <div className="space-y-2">
                <Label
                  htmlFor="login-username"
                  className="text-sm font-medium text-slate-200"
                >
                  Username
                </Label>

                <div className="relative">
                  <UserRound
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />

                  <Input
                    id="login-username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    aria-invalid={Boolean(errors.username)}
                    aria-describedby={
                      errors.username ? "login-username-error" : undefined
                    }
                    {...register("username")}
                    className="h-11 border-white/15 bg-white/[0.04] pl-10 text-white placeholder:text-slate-400 focus-visible:ring-cyan-400"
                  />
                </div>

                {errors.username?.message && (
                  <p
                    id="login-username-error"
                    className="text-xs font-medium text-rose-400"
                    role="alert"
                  >
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="login-password"
                  className="text-sm font-medium text-slate-200"
                >
                  Password
                </Label>

                <div className="relative">
                  <LockKeyhole
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />

                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "login-password-error" : undefined
                    }
                    {...register("password")}
                    className="h-11 border-white/15 bg-white/[0.04] pl-10 pr-11 text-white placeholder:text-slate-400 focus-visible:ring-cyan-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {errors.password?.message && (
                  <p
                    id="login-password-error"
                    className="text-xs font-medium text-rose-400"
                    role="alert"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Login error */}
              {serverError && (
                <p
                  className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300"
                  role="alert"
                >
                  {serverError}
                </p>
              )}

              {/* Information */}
              {infoMessage && (
                <p
                  className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2.5 text-sm leading-5 text-cyan-200"
                  role="status"
                >
                  {infoMessage}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full rounded-lg bg-cyan-400 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign in to dashboard"}
              </Button>

              <p className="pt-1 text-center text-xs leading-5 text-slate-400">
                Authorized personnel only. Your session is protected.
              </p>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginDialog;
