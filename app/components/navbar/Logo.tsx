"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();
  return (
    <Link href="/">
      <Image
        alt="Logo"
        className="cursor-pointer"
        height="80"
        width="80"
        src="/roam.png"
        priority={true}
      />
    </Link>
  );
};

export default Logo;
