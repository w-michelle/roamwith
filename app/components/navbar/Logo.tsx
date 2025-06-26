"use client";

import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/main">
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
