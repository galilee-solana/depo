import Link from "next/link";
import Image from "next/image";

function Nav() {
  return (
    <nav className="relative top-4 flex items-center justify-between bg-white h-16 mx-5 sm:mx-10 md:mx-24 lg:mx-36 xl:mx-48 rounded-lg px-3 text-black z-11">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image src="/D-logo-white.svg" alt="Logo" width={0} height={0} className="h-10 w-auto object-contain" priority />
        </Link>
        <Link href="/#how-it-works" className="hidden sm:block">
          How it works
        </Link>
      </div>
      <Link href="/demo/escrow" className="border border-black px-4 py-2 rounded-md hover:bg-gray-100 transition">
        Try Now
      </Link>
    </nav>
  )
}

export default Nav;