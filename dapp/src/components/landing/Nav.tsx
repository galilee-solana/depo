"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

function Nav() {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 flex justify-center transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`} style={{pointerEvents: 'none'}}>
      <div className="max-w-5xl w-[95%] mt-4 bg-white rounded-full shadow-lg flex justify-between items-center px-6 py-2 text-black" style={{pointerEvents: 'auto'}}>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image src="/LOGO.svg" alt="Logo" width={32} height={32} className="h-10 sm:h-12 w-24 object-contain" priority />
          </Link>
        </div>
        <div className="hidden sm:flex flex-1 justify-center gap-8 text-md">
          <Link href="/#how-it-works" className="hover:underline">How It Works</Link>
          {/* <Link href="/#use-cases" className="hover:underline">Use Cases</Link> */}
          <Link href="/#feedback" className="hover:underline">Feedback</Link>
        </div>
        <div>
          <Link href="/demo/escrow" className="border-2 border-black px-4 sm:px-6 py-2 rounded-lg text-md sm:text-lg hover:bg-gray-100 transition">
            Try Now
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Nav;