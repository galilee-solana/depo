import HeaderSection from '@/components/landing/HeaderSection'
import HowItWorkSection from '@/components/landing/HowItWorkSection'
import Nav from '@/components/landing/Nav'
import FeedbackSection from '@/components/landing/FeedbackSection'

export default function Page() {
    return (
      <div className='bg-cream'>
        <Nav  />
        <HeaderSection />
        <HowItWorkSection />
        <FeedbackSection />
      </div>
    )
}

