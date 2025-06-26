"use client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import Input from "../inputs/Input";

import { IoMdClose } from "react-icons/io";

import { FcGoogle } from "react-icons/fc";
import * as yup from "yup";

import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { useModal } from "@/app/hooks/useModal";

type FormData = {
  email: string;
  password: string;
  name?: string;
};

const LoginModal = () => {
  const modal = useModal();

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const router = useRouter();

  const schema = yup.object().shape({
    email: yup.string().required("Email is required").email("Email is invalid"),
    password: yup
      .string()
      .required("No password provided.")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      setIsLoading(true);
      const callback = await signIn("credentials", {
        ...data,
        redirect: true,
      });

      if (callback?.ok) {
        toast.success("Logged in");

        router.refresh();
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
        modal.onClose();

        reset();
      } else if (callback?.error) {
        toast.error(callback.error);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggle = useCallback(() => {
    modal.onClose();
    modal.onOpen("register");
  }, [modal]);

  if (isLoading) {
    return (
      <div className="opacity-50 bg-neutral-400 w-full h-screen absolute top-0 left-0">
        <Loading />
      </div>
    );
  }

  if (modal.openModal !== "login") {
    return null;
  }

  return (
    <div className="flex items-center justify-center fixed inset-0 bg-neutral-800/70 z-10">
      <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto">
        <div
          className={`translate duration-300 h-full ${
            modal.openModal == "login" ? "translate-y-0" : "translate-y-full"
          } ${modal.openModal == "login" ? "opacity-100" : "opacity-0"}`}
        >
          <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
              <button
                onClick={modal.onClose}
                className="p-1 border-0 hover:opacity-70 transition absolute left-9"
              >
                <IoMdClose size={18} />
              </button>
              <div className="text-lg font-semibold">Login</div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className=" p-6 flex-auto">
                <div className="flex flex-col gap-4">
                  <Input
                    id="email"
                    label="Email"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                  />
                  <Input
                    id="password"
                    type="password"
                    label="Password"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 p-6">
                <input
                  type="submit"
                  disabled={isLoading}
                  value="Login"
                  className="hover:cursor-pointer relative py-3 text-white w-full rounded-lg border-2  hover:bg-cusGreen/80 bg-cusGreen disabled:bg-cusGreen/30 disabled:cursor-not-allowed"
                />
              </div>
            </form>
            {/* other login */}
            <div className="flex flex-col gap-4 mt-3 p-6">
              <hr />

              <div className="relative ">
                <button
                  onClick={() => signIn("google", { callbackUrl: "/main" })}
                  className="py-3 border-2 w-full border-black rounded-lg hover:opacity-80 transition"
                >
                  <FcGoogle
                    size={24}
                    className="absolute left-4 top-3"
                  />
                  Continue with Google
                </button>
              </div>
            </div>
            <div className="text-neutral-500 text-center my-4 font-light">
              <div className="justify-center flex flex-row items-center gap-2">
                <div>First time?</div>
                <div
                  onClick={toggle}
                  className="text-neutral-800 cursor-pointer hover:underline "
                >
                  Create an account
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
