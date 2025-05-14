"use client"

function FeedbackSection() {
  return (
    <div id="feedback" className='h-fit mx-8 sm:pt-3 pb-3 sm:pb-12 sm:mx-16 md:mx-56 text-black font-space'>
      <h2 className="text-[30px] sm:text-[40px] md:text-[46px] my-6">Feedback</h2>
      <iframe data-tally-src="https://tally.so/embed/wA0Eao?alignLeft=1&hideTitle=1&dynamicHeight=1" 
        loading="lazy" width="100%" height="418" frameBorder="0" marginHeight={0} marginWidth={0} title="Tell us more about you?"
        className="rounded-2xl items-center justify-center"
        >
        </iframe>
    </div>
  )
}

export default FeedbackSection;