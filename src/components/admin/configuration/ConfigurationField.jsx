import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ConfigurationField = ({
  id,
  label,
  value,
  onChange,
  placeholder = "",
  description,
  type = "text",
  required = false,
  disabled = false,
  autoComplete,
  min,
  max,
  step,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-slate-200">
        {label}
        {required && <span className="ml-1 text-cyan-400">*</span>}
      </Label>

      <div className="relative">
        <Input
          id={id}
          name={id}
          type={isPassword && showPassword ? "text" : type}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          min={min}
          max={max}
          step={step}
          className={`h-11 border-white/10 bg-[#080e13] text-slate-100 placeholder:text-slate-600 focus-visible:border-cyan-400/60 focus-visible:ring-cyan-400/20 ${
            isPassword ? "pr-11" : ""
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-300"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>

      {description && (
        <p className="text-xs leading-5 text-slate-500">{description}</p>
      )}
    </div>
  );
};

export default ConfigurationField;
