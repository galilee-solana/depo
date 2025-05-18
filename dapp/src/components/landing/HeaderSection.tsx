import Link from "next/link";

function HeaderSection() {
  return (
    <div className="relative w-full h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
      <video 
        src="/vault.mp4" 
        autoPlay 
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 rounded-b-2xl"
      />
      <div className="absolute inset-0 bg-black opacity-60 z-10 rounded-b-2xl" />
      <div className="relative z-20 w-full max-w-3xl px-4 text-center">
        <h1 className="text-[35px] sm:text-[55px] md:text-[80px] leading-tight text-white font-bold font-space pb-18">
          Hold Funds.<br/> Automate <span className="blue-gradient-text" data-text="Trust.">Trust.</span>
        </h1>
        <p className="text-white text-md sm:text-2xl mt-4 font-bold text-shadow font-space">
          Secure funds with on-chain logic<br />
          and automate releases with confidence
        </p>
        <div className="mt-8">
          <Link
            href={process.env.NEXT_PUBLIC_NEWLETTER_SIGNUP_URL || '#'}
            className="px-6 sm:px-8 py-3 rounded-md text-white text-lg sm:text-xl transition-colors blue-gradient-bg"
          >
            Join the waitlist
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeaderSection;