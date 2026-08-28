import { Link } from 'react-router-dom'
import { 
  Home, Key, FileText, Search, Handshake, TrendingUp,
  ClipboardCheck, MessageSquare, Building2, ShieldCheck,
  Users, Award, ArrowRight
} from 'lucide-react'
import servicesHero from '../assets/hero/hero.jpeg'

function Services() {
  const services = [
    {
      icon: Home,
      title: "Property Sales",
      description: "We help you buy or sell residential and commercial properties with expert guidance at every step, from valuation to closing.",
    },
    {
      icon: Key,
      title: "Rental Management",
      description: "Full rental management services including tenant screening, lease agreements, rent collection, and property maintenance coordination.",
    },
    {
      icon: Search,
      title: "Property Search",
      description: "Personalized property search based on your budget, location preferences, and lifestyle needs across Sri Lanka.",
    },
    {
      icon: FileText,
      title: "Legal & Documentation",
      description: "Assistance with title verification, deed preparation, and all legal paperwork required for a smooth property transaction.",
    },
    {
      icon: TrendingUp,
      title: "Property Valuation",
      description: "Accurate market-based property valuations to help you make informed investment decisions with confidence.",
    },
    {
      icon: Handshake,
      title: "Investment Advisory",
      description: "Expert advice on land and property investments, helping you identify high-growth opportunities across the island.",
    },
  ]

  const steps = [
    { icon: MessageSquare, title: "Consultation", description: "Share your requirements and we'll understand your property goals." },
    { icon: Search, title: "Property Matching", description: "We shortlist properties that match your criteria and budget." },
    { icon: ClipboardCheck, title: "Site Visits", description: "Schedule viewings and get detailed insights on shortlisted properties." },
    { icon: Building2, title: "Deal Closing", description: "We handle negotiations, paperwork, and finalize the transaction." },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative h-[480px] bg-cover bg-center flex flex-col justify-center"
        style={{ backgroundImage: `url(${servicesHero})` }}
      >
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative max-w-7xl mx-auto px-4 w-full text-center">
          <p className="text-secondary text-lg mb-2">What We Offer</p>
          <h1 
            className="text-white text-5xl md:text-6xl leading-tight mb-4"
            style={{ fontFamily: 'var(--font-hero)' }}
          >
            Our Services
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            End-to-end property solutions designed to make buying, selling, and renting 
            simple, transparent, and stress-free.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-medium mb-3">What We Do</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            From first search to final signature, our team supports you through 
            every stage of your property journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div 
                key={service.title} 
                className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition"
              >
                <div className="w-14 h-14 rounded-xl bg-navy flex items-center justify-center mb-5">
                  <Icon size={24} className="text-secondary" />
                </div>
                <h3 className="text-xl font-heading font-medium mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-medium mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A simple, four-step process to help you reach your property goals faster.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="text-center relative">
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-secondary flex items-center justify-center mx-auto mb-4">
                    <Icon size={26} className="text-navy" />
                  </div>
                  <span className="text-secondary font-bold text-sm">Step {index + 1}</span>
                  <h3 className="text-lg font-heading font-medium mb-2 mt-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-heading font-medium mb-5">
              Why Choose Ceylon Properties
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              With years of experience in the Sri Lankan real estate market, we combine 
              local expertise with modern technology to deliver a seamless property 
              experience for buyers, sellers, and renters alike.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} className="text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Verified Listings</h4>
                  <p className="text-sm text-gray-500">Every property is verified for authenticity before listing.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center shrink-0">
                  <Users size={20} className="text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Dedicated Agents</h4>
                  <p className="text-sm text-gray-500">A personal agent to guide you through the entire process.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center shrink-0">
                  <Award size={20} className="text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Trusted Reputation</h4>
                  <p className="text-sm text-gray-500">Thousands of satisfied clients across Sri Lanka.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-navy rounded-2xl p-6 text-center text-white">
              <p className="text-3xl font-bold mb-1">12K+</p>
              <p className="text-sm text-white/70">Properties Listed</p>
            </div>
            <div className="bg-secondary rounded-2xl p-6 text-center text-black">
              <p className="text-3xl font-bold mb-1">8K+</p>
              <p className="text-sm">Happy Clients</p>
            </div>
            <div className="bg-secondary rounded-2xl p-6 text-center text-black">
              <p className="text-3xl font-bold mb-1">15+</p>
              <p className="text-sm">Years Experience</p>
            </div>
            <div className="bg-navy rounded-2xl p-6 text-center text-white">
              <p className="text-3xl font-bold mb-1">24/7</p>
              <p className="text-sm text-white/70">Client Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-navy">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 
            className="text-white text-4xl mb-4"
            style={{ fontFamily: 'var(--font-hero)' }}
          >
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Whether you're buying, selling, or renting, our team is here to help 
            you every step of the way.
          </p>
          <Link 
            to="/contact"
            className="inline-flex items-center gap-2 bg-secondary text-black font-semibold px-8 py-3.5 rounded-full hover:opacity-90 transition"
          >
            Contact Us
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Services