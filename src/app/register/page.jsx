"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaUpload } from "react-icons/fa";
import { Label } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { useForm, useWatch } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { uploadToCloudinary } from "@/lib/cloudinary";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const passwordValue = useWatch({ control, name: "password" });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    let imageUrl = null;
    if (imageFile) {
      setUploadingImage(true);
      try {
        imageUrl = await uploadToCloudinary(imageFile);
      } catch (err) {
        toast.error(err.message || "Image upload failed. Try again.");
        setUploadingImage(false);
        return;
      }
      setUploadingImage(false);
    }

    const { data: signUpData, error: signUpError } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      image: imageUrl ?? undefined,
      role: "user",
    });

    if (signUpError) {
      toast.error(signUpError.message || "Registration failed. Please try again.");
      return;
    }

    toast.success("Account created successfully!");
    router.push("/login");
  };

  return (
    <section className="min-h-screen bg-[#14151A] flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-4xl grid overflow-hidden rounded-[28px] border border-[#FF5B3C]/10 bg-[#1A1C22] shadow-[0_0_100px_-40px_rgba(255,91,60,.30)] lg:grid-cols-2">
        
        {/* LEFT IMAGE */}
        <div className="relative hidden lg:block">
          <img src="/g2.jpg" alt="Fitness" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14151A] via-[#14151A]/20 to-transparent" />
          <div className="absolute left-8 bottom-8">
            <h2 className="text-4xl font-black leading-tight text-white">Train<br />Beyond Limits</h2>
            <p className="mt-3 max-w-[260px] text-sm text-gray-300">Build strength, discipline and confidence.</p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="mt-2 text-sm text-[#9A9CA6]">Start your fitness journey</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
              {/* FULL NAME */}
              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-semibold text-gray-400 px-1">Full Name</Label>
                <input
                  {...register("name", { required: "Name is required" })}
                  type="text"
                  placeholder="Full Name"
                  className="w-full rounded-xl border border-white/10 bg-[#14151A] px-5 py-3 text-white outline-none focus:border-[#FF5B3C]"
                />
                {errors.name && <p className="text-red-500 text-xs px-1">{errors.name.message}</p>}
              </div>

              {/* EMAIL */}
              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-semibold text-gray-400 px-1">Email Address</Label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
                  })}
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-xl border border-white/10 bg-[#14151A] px-5 py-3 text-white outline-none focus:border-[#FF5B3C]"
                />
                {errors.email && <p className="text-red-500 text-xs px-1">{errors.email.message}</p>}
              </div>

              {/* PROFILE IMAGE — Updated to "Choose File" Button Layout */}
              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-semibold text-gray-400 px-1">Profile Image</Label>
                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#14151A] p-2 pr-4">
                  
                  {/* Hidden Native Input */}
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {/* Custom Styled Trigger Button */}
                  <label
                    htmlFor="profile-image-upload"
                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-white/5 border border-white/5 px-4 py-2 text-xs font-semibold text-[#F5F3EF] hover:bg-white/10 active:scale-95 transition-all shrink-0"
                  >
                    <FaUpload className="text-[#FF5B3C]" />
                    Choose File
                  </label>

                  {/* Preview Avatar or File Name Status */}
                  <div className="flex items-center gap-2 overflow-hidden w-full">
                    {imagePreview ? (
                      <>
                        <img 
                          src={imagePreview} 
                          alt="Avatar Preview" 
                          className="h-7 w-7 rounded-full object-cover border border-white/10 shrink-0" 
                        />
                        <span className="text-xs text-gray-400 truncate">
                          {imageFile ? imageFile.name : "image_selected.png"}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-500 truncate">No file chosen</span>
                    )}
                  </div>

                </div>
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-semibold text-gray-400 px-1">Password</Label>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z]).+$/,
                        message: "Must include uppercase and lowercase letters",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full rounded-xl border border-white/10 bg-[#14151A] px-5 py-3 text-white outline-none focus:border-[#FF5B3C]"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#FF5B3C]">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs px-1">{errors.password.message}</p>}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-semibold text-gray-400 px-1">Confirm Password</Label>
                <input
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === passwordValue || "Passwords do not match",
                  })}
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full rounded-xl border border-white/10 bg-[#14151A] px-5 py-3 text-white outline-none focus:border-[#FF5B3C]"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs px-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || uploadingImage}
                className="w-full rounded-xl bg-[#FF5B3C] py-3 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploadingImage ? "Uploading photo..." : isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="my-5 flex items-center">
              <div className="h-px flex-1 bg-white/10" />
              <span className="px-3 text-xs text-gray-500">OR</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/" })}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 py-3 text-white transition hover:border-[#FF5B3C]"
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-gray-400">
              Already have account?
              <Link href="/login" className="ml-2 font-semibold text-[#FF5B3C]">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}