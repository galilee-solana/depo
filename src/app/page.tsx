'use client'

import Nav from '@/components/ui/nav/Nav'
import Link from 'next/link'

export default function Page() {
    return (
      <div className="bg-cream min-h-screen flex flex-col">
        <div className="relative z-20">
          <Nav />
        </div>
        <div className="flex-1 relative -mt-16">
          <video 
            src="/vault.mp4" 
            autoPlay 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-70"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 w-full max-w-3xl px-4">
            <h1 className="text-[35px] sm:text-[55px] md:text-[75px] font-bold leading-tight text-white heading-shadow">
              Hold Funds.<br/> Automate <span className="blue-gradient-text blue-gradient-text" data-text="Trust.">Trust.</span>
            </h1>
            <p className="text-white text-lg sm:text-2xl mt-4 font-bold text-shadow">
              Secure funds with on-chain logic<br />
              and automate releases with confidence
            </p>
            <div className="mt-8">
              <Link
                href="/demo/escrow"
                className="px-6 sm:px-8 py-3 rounded-md text-white font-medium text-md sm:text-xl transition-colors blue-gradient-bg"
              >
                TRY NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
}

