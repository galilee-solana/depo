import InfoCard from "@/components/landing/InfoCard";

function HowItWorkSection() {
  return (
    <div id="how-it-works" className='h-fit mx-8 sm:pt-3 pb-3 sm:pb-12 sm:mx-16 xl:mx-56 text-black font-space'>
      <h2 className="text-[30px] sm:text-[40px] md:text-[46px] my-6">How It Works</h2>
      <div className="flex flex-col lg:flex-row gap-3">
        <InfoCard 
          icon="/icons/modular-icon.svg" 
          alt="Modular Infrastructure"
          title="Build Your Own Escrow Flow"
          subtitle="Every project is different"
          body="With DEPO's modular system, you can combine features like time locks, minimum thresholds, and target conditions to build escrow flows as simple or complex as you need."
          />
        <InfoCard 
          icon="/icons/code-icon.svg" 
          alt="Integrate into your own app"
          title="Integrate With Your Stack"
          subtitle="Giving you the tools to launch, manage, and automate escrow flows with ease."
          body="We’re actively developing a lightweight SDK and flexible API to bring secure, on-chain escrow directly into your app, platform, or service."
          comingSoon={true}
          />
      </div>
    </div>
  )
}

export default HowItWorkSection;