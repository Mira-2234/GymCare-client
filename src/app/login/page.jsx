"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const {
        data: signInData,
        error: signInError,
      } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      console.log(signInData, signInError);

      if (signInError) {
        toast.error("Login failed");
        return;
      }

      toast.success("Login successful");
      router.push("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <section className="min-h-screen bg-[#14151A] flex items-center justify-center px-5 py-8">

      <div
        className="
        w-full
        max-w-4xl
        grid
        overflow-hidden
        rounded-[28px]
        border
        border-[#FF5B3C]/10
        bg-[#1A1C22]
        shadow-[0_0_100px_-40px_rgba(255,91,60,.30)]
        lg:grid-cols-2
      "
      >

        {/* LEFT */}
        <div className="relative hidden lg:block">

          <img
            src="/g1.jpg"
            alt="Fitness Login"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#14151A] via-[#14151A]/20 to-transparent" />

          <div className="absolute left-8 bottom-8">

            <h2 className="text-4xl font-black text-white">
              Train
              <br />
              Beyond Limits
            </h2>

            <p className="mt-3 text-sm text-gray-300">
              Build strength, discipline and confidence.
            </p>

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center px-8 py-12">

          <div className="w-full max-w-sm">

            <h1 className="text-3xl font-bold text-white">
              Sign In
            </h1>

            <p className="mt-2 text-sm text-[#9A9CA6]">
              Enter your credentials
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-4"
            >

              {/* EMAIL */}
              <div>

                <input
                  {...register("email", {
                    required: "Email required",
                  })}
                  type="email"
                  placeholder="Email"
                  className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-[#14151A]
                  px-5
                  py-3
                  text-white
                "
                />

                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}

              </div>

              {/* PASSWORD */}
              <div className="relative">

                <input
                  {...register("password", {
                    required: "Password required",
                  })}
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-[#14151A]
                  px-5
                  py-3
                  text-white
                "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  text-[#FF5B3C]
                "
                >

                  {showPassword
                    ? <FaEyeSlash />
                    : <FaEye />}

                </button>

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}

              </div>

              {/* LOGIN */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                w-full
                rounded-xl
                bg-[#FF5B3C]
                py-3
                font-semibold
                text-black
              "
              >

                {
                  isSubmitting
                    ? "Signing In..."
                    : "Sign In"
                }

              </button>

            </form>

            <div className="my-6 flex items-center">

              <div className="h-px flex-1 bg-white/10" />

              <span className="px-3 text-xs text-gray-500">
                OR
              </span>

              <div className="h-px flex-1 bg-white/10" />

            </div>

            <button
              onClick={() =>
                authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/",
                })
              }
              className="
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-xl
              border
              border-white/10
              py-3
              text-white
            "
            >

              <FcGoogle />

              Continue with Google

            </button>

            <p className="mt-8 text-center text-sm text-gray-400">

              New here?

              <Link
                href="/register"
                className="
                ml-2
                text-[#FF5B3C]
                font-semibold
              "
              >
                Create Account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
