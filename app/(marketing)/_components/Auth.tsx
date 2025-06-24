"use client";
import { signIn } from "next-auth/react";

import toast from "react-hot-toast";

import { Suspense, useState } from "react";

import Loader from "../../components/Loader";
import { useRouter } from "next/navigation";

export const Auth = () => {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <AuthSuspense />
    </Suspense>
  );
};

const AuthSkeleton = () => {
  return <Loader />;
};

const AuthSuspense = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGuest = async () => {
    setLoading(true);
    try {
      const response = await signIn("credentials", {
        email: "roamguest@roamwith.com",
        password: "roamwith2024@",
        redirect: true,
      });
      if (response?.ok) {
        toast.success("Welcome");
        router.push("/");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={() => handleGuest()}
        disabled={loading}
        className="mt-4 disabled:cursor-not-allowed disabled:bg-cusGreen/30 py-3 px-6 text-xs bg-cusGreen text-white rounded-md hover:text-cusGreen hover:bg-[#16461e]"
      >
        TESTER LOG IN
      </button>

      {loading && (
        <div className="absolute top-0 left-0 h-screen flex items-center justify-center w-full bg-white opacity-95">
          <Loader />
          <p className="absolute bg-transparent">Loading...</p>
        </div>
      )}
    </div>
  );
};
