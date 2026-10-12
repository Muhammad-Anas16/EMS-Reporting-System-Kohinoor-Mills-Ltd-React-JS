// import { useEffect } from "react";
// import { useForm } from "react-hook-form";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const inputClassName =
//   "border-white/10 bg-[#080e13] text-slate-100 placeholder:text-slate-600 focus-visible:border-cyan-400/50 focus-visible:ring-cyan-400/20";

// const defaultValues = {
//   username: "",
//   password: "",
//   type: "",
// };

// const CreateUserDialog = ({ open, onOpenChange, onSubmit }) => {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues,
//   });

//   // Clear the form when the dialog closes.
//   useEffect(() => {
//     if (!open) {
//       reset(defaultValues);
//     }
//   }, [open, reset]);

//   const handleDialogChange = (nextOpen) => {
//     if (!nextOpen) {
//       reset(defaultValues);
//     }

//     onOpenChange(nextOpen);
//   };

//   return (
//     <Dialog open={open} onOpenChange={handleDialogChange}>
//       <DialogContent className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1116] p-0 text-slate-100 shadow-2xl shadow-black/50 sm:max-w-[480px]">
//         {/* Header */}
//         <DialogHeader className="border-b border-white/[0.08] px-6 pb-5 pt-6">
//           <DialogTitle className="text-xl font-semibold tracking-tight text-white">
//             Create user
//           </DialogTitle>

//           <DialogDescription className="max-w-[380px] text-sm leading-6 text-slate-400">
//             Enter the username, password, and division type to control which
//             division's data the user can access.
//           </DialogDescription>
//         </DialogHeader>

//         {/* Form */}
//         <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 pt-5">
//           <div className="space-y-5">
//             {/* Username */}
//             <div className="space-y-2">
//               <Label
//                 htmlFor="user-username"
//                 className="text-sm font-medium text-slate-300"
//               >
//                 Username
//               </Label>

//               <Input
//                 id="user-username"
//                 autoComplete="username"
//                 placeholder="Enter username"
//                 className={`${inputClassName} h-11 rounded-lg`}
//                 {...register("username", {
//                   required: "Username is required.",
//                   validate: (value) =>
//                     value.trim().length > 0 || "Username cannot be empty.",
//                 })}
//               />

//               {errors.username && (
//                 <p className="text-xs text-rose-400">
//                   {errors.username.message}
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="space-y-2">
//               <Label
//                 htmlFor="user-password"
//                 className="text-sm font-medium text-slate-300"
//               >
//                 Password
//               </Label>

//               <Input
//                 id="user-password"
//                 type="password"
//                 autoComplete="new-password"
//                 placeholder="At least 8 characters"
//                 className={`${inputClassName} h-11 rounded-lg`}
//                 {...register("password", {
//                   required: "Password is required.",
//                   minLength: {
//                     value: 8,
//                     message: "Password must contain at least 8 characters.",
//                   },
//                 })}
//               />

//               {errors.password && (
//                 <p className="text-xs text-rose-400">
//                   {errors.password.message}
//                 </p>
//               )}

//               <p className="text-xs text-slate-500">
//                 Use at least 8 characters.
//               </p>
//             </div>

//             {/* Division type */}
//             <div className="space-y-2">
//               <Label
//                 htmlFor="user-type"
//                 className="text-sm font-medium text-slate-300"
//               >
//                 Division type
//               </Label>

//               <Input
//                 id="user-type"
//                 placeholder="e.g. Weaving, Dyeing, Apparel"
//                 className={`${inputClassName} h-11 rounded-lg`}
//                 {...register("type", {
//                   required: "Division type is required.",
//                   validate: (value) =>
//                     value.trim().length > 0 || "Division type cannot be empty.",
//                 })}
//               />

//               {errors.type && (
//                 <p className="text-xs text-rose-400">{errors.type.message}</p>
//               )}

//               <p className="text-xs text-slate-500">
//                 Specify the division this user can access.
//               </p>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/[0.08] pt-5">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => handleDialogChange(false)}
//               className="h-10 cursor-pointer border-white/10 bg-white/[0.03] px-4 text-slate-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
//             >
//               Cancel
//             </Button>

//             <Button
//               type="submit"
//               className="h-10 cursor-pointer bg-cyan-400 px-4 font-medium text-slate-950 shadow-sm shadow-cyan-500/10 hover:bg-cyan-300"
//             >
//               Create user
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreateUserDialog;

import { useEffect } from "react";
import { useForm } from "react-hook-form";

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

const inputClassName =
  "border-white/10 bg-[#080e13] text-slate-100 placeholder:text-slate-600 focus-visible:border-cyan-400/50 focus-visible:ring-cyan-400/20";

const selectClassName =
  "h-11 w-full rounded-lg border border-white/10 bg-[#080e13] px-3 text-slate-100 outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20";

const defaultValues = {
  username: "",
  password: "",
  type: "",
};

const divisionTypes = ["Dyeing", "Apparel", "KGL", "Weaving"];

const CreateUserDialog = ({ open, onOpenChange, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  // Clear the form when the dialog closes.
  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const handleDialogChange = (nextOpen) => {
    if (!nextOpen) {
      reset(defaultValues);
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1116] p-0 text-slate-100 shadow-2xl shadow-black/50 sm:max-w-[480px]">
        {/* Header */}
        <DialogHeader className="border-b border-white/[0.08] px-6 pb-5 pt-6">
          <DialogTitle className="text-xl font-semibold tracking-tight text-white">
            Create user
          </DialogTitle>

          <DialogDescription className="max-w-[380px] text-sm leading-6 text-slate-400">
            Enter the username, password, and select the division this user can
            access.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 pt-5">
          <div className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <Label
                htmlFor="user-username"
                className="text-sm font-medium text-slate-300"
              >
                Username
              </Label>

              <Input
                id="user-username"
                autoComplete="username"
                placeholder="Enter username"
                className={`${inputClassName} h-11 rounded-lg`}
                {...register("username", {
                  required: "Username is required.",
                  validate: (value) =>
                    value.trim().length > 0 || "Username cannot be empty.",
                })}
              />

              {errors.username && (
                <p className="text-xs text-rose-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="user-password"
                className="text-sm font-medium text-slate-300"
              >
                Password
              </Label>

              <Input
                id="user-password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className={`${inputClassName} h-11 rounded-lg`}
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 8,
                    message: "Password must contain at least 8 characters.",
                  },
                })}
              />

              {errors.password && (
                <p className="text-xs text-rose-400">
                  {errors.password.message}
                </p>
              )}

              <p className="text-xs text-slate-500">
                Use at least 8 characters.
              </p>
            </div>

            {/* Division type dropdown */}
            <div className="space-y-2">
              <Label
                htmlFor="user-type"
                className="text-sm font-medium text-slate-300"
              >
                Division type
              </Label>

              <select
                id="user-type"
                className={selectClassName}
                defaultValue=""
                {...register("type", {
                  required: "Please select a division type.",
                })}
              >
                <option value="" disabled className="bg-[#080e13]">
                  Select division
                </option>

                {divisionTypes.map((division) => (
                  <option
                    key={division}
                    value={division}
                    className="bg-[#080e13]"
                  >
                    {division}
                  </option>
                ))}
              </select>

              {errors.type && (
                <p className="text-xs text-rose-400">{errors.type.message}</p>
              )}

              <p className="text-xs text-slate-500">
                Select the division this user can access.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/[0.08] pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogChange(false)}
              className="h-10 cursor-pointer border-white/10 bg-white/[0.03] px-4 text-slate-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="h-10 cursor-pointer bg-cyan-400 px-4 font-medium text-slate-950 shadow-sm shadow-cyan-500/10 hover:bg-cyan-300"
            >
              Create user
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
