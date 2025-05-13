import HeaderSection from '@/components/landing/HeaderSection'
import HowItWorkSection from '@/components/landing/HowItWorkSection'
import Nav from '@/components/landing/Nav'


export default function Page() {
    return (
      <div className='bg-cream'>
        <Nav  />
        <HeaderSection />
        <HowItWorkSection />
      </div>
    )
}

