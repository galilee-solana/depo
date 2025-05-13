import HeaderSection from '@/components/landing/HeaderSection'
import HowItWorkSection from '@/components/landing/HowItWorkSection'
import Nav from '@/components/landing/Nav'
import FeedbackSection from '@/components/landing/FeedbackSection'
import Footer from '@/components/landing/Footer'

export default function Page() {
    return (
      <div className='bg-cream'>
        <Nav  />
        <HeaderSection />
        <HowItWorkSection />
        <FeedbackSection />
        <Footer />
      </div>
    )
}

