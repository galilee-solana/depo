'use client'

import Nav from '@/components/ui/nav/Nav'
import Image from 'next/image'

export default function Page() {
    return (
      <div className="bg-cream h-full relative">
        <Nav />
        <div className="w-full h-full -mt-16">
          <Image 
            src="/vault.gif" 
            alt="Vault" 
            width={500} 
            height={500} 
            className="w-full h-full object-cover"
            unoptimized={true}
            style={{ animationIterationCount: 1 }} 
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 w-full max-w-3xl px-4">
            <h1 className="text-[55px] md:text-[75px] font-bold leading-tight text-white heading-shadow">
              Hold Funds. Automate <span className="blue-gradient-text blue-gradient-text" data-text="Trust.">Trust.</span>
            </h1>
            <p className="text-white text-2xl mt-4 font-bold text-shadow">
              Secure funds with on-chain logic,<br />
              and automate releases with confidence
            </p>
            <div className="mt-8">
              <a 
                href="#" 
                className="px-8 py-3 rounded-md text-white font-medium text-lg transition-colors blue-gradient-bg"
              >
                Try Now
              </a>
            </div>
          </div>
        </div>
      </div>
    )
}

