import React from 'react'
import type { Metadata } from 'next'
import { Button, Card, CardContent } from '@/components/ui'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { VendorCarousel } from '@/components/experiences/HorizontalExperiences'
import { CTASection } from '@/components/landing/CTASection'
import { ValuePropositionSection } from '@/components/landing/ValuePropositionSection'
import { SocialProofSection } from '@/components/landing/SocialProofSection'
import JsonLd from '@/components/seo/JsonLd'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Melbourne Mobile Coffee Carts | The Bean Route',
  description: 'Book verified mobile coffee carts in Melbourne. Serving CBD, Carlton, Fitzroy & 20+ suburbs. Corporate events, weddings, festivals. Free quotes in 60 seconds.',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a mobile coffee cart cost in Melbourne?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Melbourne mobile coffee carts typically cost $150-$350 per hour, depending on the vendor, event type, guest count, and duration. Most vendors offer transparent hourly rates with no hidden fees. You can filter vendors by price range on our browse page and get free quotes in 60 seconds.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which Melbourne suburbs do you cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Bean Route connects you with verified coffee cart vendors across Melbourne, including CBD, Carlton, Fitzroy, Collingwood, Richmond, South Yarra, Prahran, St Kilda, Brunswick, Hawthorn, Kew, Camberwell, and 20+ other suburbs. You can filter vendors by your event suburb to find carts that serve your area.',
      },
    },
    {
      '@type': 'Question',
      name: 'How far in advance should I book a coffee cart?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For weekday events, booking 1-2 weeks in advance is usually sufficient. For weekend events or peak season (October-March), we recommend booking 2-3 weeks ahead to ensure vendor availability. Some vendors may accommodate last-minute bookings depending on their schedule.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do coffee carts need power at my event?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most espresso-based coffee carts require a standard 240V power outlet or generator to run their espresso machines. Some carts are fully self-contained with generators, while others need a power source from your venue. Check with your chosen vendor during the inquiry process to confirm power requirements for your event.',
      },
    },
  ],
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <JsonLd data={faqSchema} />
      <Header variant="landing" />

      {/* Above-the-fold CTA Section */}
      <CTASection />

      {/* Value Proposition Section */}
      <ValuePropositionSection />

      {/* Vendor Carousel */}
      <section id="vendors" className="py-20 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VendorCarousel />
        </div>
      </section>

      {/* Social Proof Section */}
      <SocialProofSection />

      {/* How It Works */}
      <section className="py-20" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: '#1A1A1A' }}>
              How it works
            </h2>
            <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
              From idea to espresso in three steps. No phone calls required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Find the right cart',
                description: 'Browse vendors by suburb, specialty, and price range. Filter by event type — corporate, wedding, festival.',
              },
              {
                step: '02',
                title: 'Submit an inquiry',
                description: 'Tell us about your event. Guest count, date, location. Takes 60 seconds. No commitment.',
              },
              {
                step: '03',
                title: 'Enjoy great coffee',
                description: 'The vendor confirms availability and details. You focus on the event. They handle the coffee.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl p-6 sm:p-8 border border-neutral-200">
                <div className="text-2xl font-bold tracking-tight mb-3" style={{ color: '#F5C842' }}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why The Bean Route */}
      <section className="py-20 bg-white border-t border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: '#1A1A1A' }}>
                Why Melbourne chooses The Bean Route
              </h2>
              <p className="text-neutral-600 mb-8 leading-relaxed">
                We started in Camberwell because we believed Melbourne deserved a better way to find
                quality mobile coffee. Now we connect the city's best carts with the events that need them.
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Vetted vendors', detail: 'Every cart on The Bean Route is reviewed. Quality and reliability, not just proximity.' },
                  { label: 'Transparent pricing', detail: 'Hourly rates upfront. No hidden fees, no surprises on the day.' },
                  { label: 'Melbourne locals', detail: 'We know the suburbs. We know the carts. We match them properly.' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#F5C842' }}>
                      <svg className="w-3 h-3" fill="none" stroke="#1A1A1A" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>{item.label}</div>
                      <div className="text-sm text-neutral-600">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-8 flex flex-col gap-6" style={{ backgroundColor: '#3B2A1A' }}>
              <div className="text-center">
                <div className="text-5xl font-bold" style={{ color: '#F5C842' }}>10+</div>
                <div className="text-sm mt-1" style={{ color: '#A0785A' }}>Verified Melbourne vendors</div>
              </div>
              <div className="border-t border-neutral-700" />
              <div className="text-center">
                <div className="text-5xl font-bold" style={{ color: '#F5C842' }}>60s</div>
                <div className="text-sm mt-1" style={{ color: '#A0785A' }}>Average inquiry time</div>
              </div>
              <div className="border-t border-neutral-700" />
              <div className="text-center">
                <div className="text-5xl font-bold" style={{ color: '#F5C842' }}>Free</div>
                <div className="text-sm mt-1" style={{ color: '#A0785A' }}>To inquire, always</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: '#1A1A1A' }}>
              Common questions
            </h2>
            <p className="text-neutral-600">
              Everything you need to know about booking a mobile coffee cart in Melbourne.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                How much does a mobile coffee cart cost in Melbourne?
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Melbourne mobile coffee carts typically cost <strong>$150-$350 per hour</strong>, depending on the vendor, event type, guest count, and duration. Most vendors offer transparent hourly rates with no hidden fees. You can filter vendors by price range on our browse page and get free quotes in 60 seconds.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                Which Melbourne suburbs do you cover?
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                The Bean Route connects you with verified coffee cart vendors across Melbourne, including <strong>CBD, Carlton, Fitzroy, Collingwood, Richmond, South Yarra, Prahran, St Kilda, Brunswick, Hawthorn, Kew, Camberwell</strong>, and 20+ other suburbs. You can filter vendors by your event suburb to find carts that serve your area.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                How far in advance should I book a coffee cart?
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                For weekday events, booking <strong>1-2 weeks in advance</strong> is usually sufficient. For weekend events or peak season (October-March), we recommend booking <strong>2-3 weeks ahead</strong> to ensure vendor availability. Some vendors may accommodate last-minute bookings depending on their schedule.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                Do coffee carts need power at my event?
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Most espresso-based coffee carts require a <strong>standard 240V power outlet or generator</strong> to run their espresso machines. Some carts are fully self-contained with generators, while others need a power source from your venue. Check with your chosen vendor during the inquiry process to confirm power requirements for your event.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20" style={{ backgroundColor: '#3B2A1A' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Ready to find your cart?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#A0785A' }}>
            Browse Melbourne's best mobile coffee carts. Free to inquire, no commitment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/app">
              <Button size="lg" className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold min-h-[48px] px-8">
                Browse All Vendors
              </Button>
            </Link>
            <Link href="/vendors-guide/get-listed">
              <Button size="lg" variant="outline" className="border-neutral-600 text-white hover:bg-neutral-800 min-h-[48px] px-8">
                List Your Cart
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
