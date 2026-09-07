import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import {
  Home,
  Key,
  FileText,
  Search,
  Handshake,
  TrendingUp,
  ClipboardCheck,
  MessageSquare,
  ShieldCheck,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  UserRound,
  BriefcaseBusiness,
  ChevronDown,
  Phone,
  Map,
} from 'lucide-react'

import servicesHero from '../assets/hero/hero.jpeg'
import Loader from '../components/property/Loader.jsx'

function Services() {
  const [openFaq, setOpenFaq] = useState(null)
  const [loading, setLoading] = useState(true)

  // =====================================================
  // INITIAL PAGE LOADING
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // =====================================================
  // SERVICES
  // =====================================================

  const services = [
    {
      icon: Home,
      title: 'Property Sales',
      description:
        'Buy or sell residential and commercial properties with professional guidance from valuation to final closing.',
      link: '/hot-sales',
    },
    {
      icon: Key,
      title: 'Rental Management',
      description:
        'Complete rental support including tenant screening, agreements, rent collection, and property maintenance.',
      link: '/stay-to-rent',
    },
    {
      icon: Search,
      title: 'Find a Property to Buy',
      description:
        'Discover properties for sale that match your preferred location, budget, property type, and requirements.',
      link: '/stay-to-buy',
    },
    {
      icon: Map,
      title: 'Find Land',
      description:
        'Explore land for sale based on your preferred location, budget, land size, and development requirements.',
      link: '/lands',
    },
    {
      icon: FileText,
      title: 'Legal & Documentation',
      description:
        'Get assistance with property documentation, title verification, agreements, and transaction paperwork.',
      link: '/contact',
    },
    {
      icon: Handshake,
      title: 'Investment Advisory',
      description:
        'Make smarter property investment decisions by identifying promising opportunities across Sri Lanka.',
      link: '/contact',
    },
  ]

  // =====================================================
  // WHO WE HELP
  // =====================================================

  const clients = [
    {
      icon: UserRound,
      title: 'Property Buyers',
      description:
        'Find the right home, land, apartment, or commercial property according to your needs and budget.',
    },
    {
      icon: BriefcaseBusiness,
      title: 'Property Sellers',
      description:
        'Showcase your property to potential buyers and get professional support throughout the selling process.',
    },
    {
      icon: Key,
      title: 'Landlords',
      description:
        'Get support managing rental properties, finding tenants, and maintaining a smooth rental process.',
    },
    {
      icon: TrendingUp,
      title: 'Investors',
      description:
        'Explore property opportunities and make informed investment decisions with market-focused guidance.',
    },
  ]

  // =====================================================
  // HOW IT WORKS
  // =====================================================

  const steps = [
    {
      icon: MessageSquare,
      number: '01',
      title: 'Consultation',
      description:
        'Tell us what you are looking for and share your property goals with our team.',
    },
    {
      icon: Search,
      number: '02',
      title: 'Property Matching',
      description:
        'We identify and shortlist properties that match your requirements and budget.',
    },
    {
      icon: ClipboardCheck,
      number: '03',
      title: 'Site Visits',
      description:
        'Visit shortlisted properties and receive useful information to help you compare them.',
    },
    {
      icon: Handshake,
      number: '04',
      title: 'Deal Closing',
      description:
        'We help coordinate negotiations, documentation, and the final transaction.',
    },
  ]

  // =====================================================
  // WHY CHOOSE US
  // =====================================================

  const benefits = [
    {
      icon: ShieldCheck,
      title: 'Verified Listings',
      description:
        'We focus on providing reliable property information so you can search with greater confidence.',
    },
    {
      icon: Users,
      title: 'Dedicated Support',
      description:
        'Our team is available to guide you through the property journey from search to completion.',
    },
    {
      icon: Award,
      title: 'Professional Service',
      description:
        'We combine local property knowledge with modern technology to simplify real estate transactions.',
    },
    {
      icon: CheckCircle2,
      title: 'Transparent Process',
      description:
        'Clear communication and straightforward processes help make your property experience easier.',
    },
  ]

  // =====================================================
  // FAQ
  // =====================================================

  const faqs = [
    {
      question: 'How can I find a property through Ceylon Properties?',
      answer:
        'You can browse our available properties using your preferred property type, location, and budget. You can also contact us directly if you need personalized assistance.',
    },
    {
      question: 'Can I list my property for sale or rent?',
      answer:
        'Yes. Property owners can submit their properties through the appropriate listing process. Our team can help you understand the requirements and next steps.',
    },
    {
      question: 'Do you help with property documentation?',
      answer:
        'Yes. We can assist with the property documentation process and help coordinate the necessary paperwork during a transaction.',
    },
    {
      question: 'Can I request a property that is not currently listed?',
      answer:
        'Yes. You can use the Wanted Properties feature to submit your requirements so property owners or sellers can identify matching opportunities.',
    },
    {
      question: 'How can I contact your team?',
      answer:
        'You can contact our team through the Contact Us page. We will be happy to discuss your property requirements and guide you further.',
    },
  ]

  // =====================================================
  // FULL-SCREEN LOADER
  // =====================================================

  if (loading) {
    return <Loader />
  }

  return (
    <div className="bg-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative
          h-[420px]
          md:h-[460px]
          bg-cover
          bg-center
          flex
          flex-col
          justify-center
        "
        style={{
          backgroundImage: `url(${servicesHero})`,
        }}
      >

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Content */}
        <div
          className="
            relative
            max-w-7xl
            mx-auto
            px-4
            w-full
            text-center
          "
        >

          {/* Heading */}
          <h1
            className="
              text-white
              text-4xl
              sm:text-5xl
              md:text-6xl
              leading-tight
              mb-4
              bold
            "
            style={{
              fontFamily: 'var(--font-hero)',
            }}
          >
            Our Services
          </h1>

          {/* Description */}
          <p
            className="
              text-white/90
              text-base
              md:text-lg
              max-w-2xl
              mx-auto
              leading-relaxed
              mb-7
            "
          >
            From finding your dream property to completing the
            final transaction, Ceylon Properties provides
            professional real estate solutions designed around
            your needs.
          </p>

          {/* Buttons */}
          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-center
              gap-3
            "
          >

            <Link
              to="/"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                bg-[#FBBF24]
                text-black
                font-semibold
                px-7
                py-3.5
                rounded-full
                hover:bg-[#FBBF24]/90
                transition
              "
            >
              Explore Properties
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/contact"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                border
                border-white/60
                text-white
                font-semibold
                px-7
                py-3.5
                rounded-full
                hover:bg-white
                hover:text-black
                transition
                min-w-[150px]
              "
            >
              Contact Us
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          TRUST STATS
      ===================================================== */}

      <section className="relative -mt-10 z-20">

        <div className="max-w-6xl mx-auto px-4">

          <div
            className="
              bg-white
              rounded-2xl
              shadow-xl
              border
              border-gray-100
              grid
              grid-cols-2
              lg:grid-cols-4
              overflow-hidden
            "
          >

            <div
              className="
                p-6
                text-center
                border-b
                lg:border-b-0
                lg:border-r
                border-gray-100
              "
            >
              <p
                className="
                  text-3xl
                  md:text-4xl
                  font-bold
                  text-[#14213D]
                "
              >
                12K+
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Properties Listed
              </p>
            </div>

            <div
              className="
                p-6
                text-center
                border-b
                lg:border-b-0
                lg:border-r
                border-gray-100
              "
            >
              <p
                className="
                  text-3xl
                  md:text-4xl
                  font-bold
                  text-[#14213D]
                "
              >
                8K+
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Happy Clients
              </p>
            </div>

            <div
              className="
                p-6
                text-center
                border-r
                border-gray-100
              "
            >
              <p
                className="
                  text-3xl
                  md:text-4xl
                  font-bold
                  text-[#14213D]
                "
              >
                15+
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Years Experience
              </p>
            </div>

            <div className="p-6 text-center">

              <p
                className="
                  text-3xl
                  md:text-4xl
                  font-bold
                  text-[#14213D]
                "
              >
                24/7
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Client Support
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          py-20
          md:py-24
        "
      >

        <div
          className="
            text-center
            max-w-2xl
            mx-auto
            mb-14
          "
        >

          <span
            className="
              text-[#FBBF24]
              font-semibold
              text-sm
              uppercase
              tracking-wider
            "
          >
            What We Offer
          </span>

          <h2
            className="
              text-3xl
              md:text-4xl
              font-heading
              font-medium
              text-[#14213D]
              mt-2
              mb-4
            "
          >
            Everything You Need

            <span className="block">
              for Your Property Journey
            </span>
          </h2>

          <p className="text-gray-500 leading-relaxed">
            Whether you are buying, selling, renting,
            or investing, our services are designed to
            make every step simpler and more convenient.
          </p>

        </div>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
        >

          {services.map((service) => {

            const Icon = service.icon

            return (
              <div
                key={service.title}
                className="
                  group
                  relative
                  border
                  border-gray-200
                  rounded-2xl
                  p-7
                  bg-white
                  hover:border-[#FBBF24]
                  hover:shadow-xl
                  transition-all
                  duration-300
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-6
                  "
                >

                  <div
                    className="
                      w-14
                      h-14
                      rounded-xl
                      bg-[#14213D]
                      flex
                      items-center
                      justify-center
                      group-hover:bg-[#FBBF24]
                      transition
                    "
                  >

                    <Icon
                      size={25}
                      className="
                        text-[#FBBF24]
                        group-hover:text-[#14213D]
                        transition
                      "
                    />

                  </div>

                  <div
                    className="
                      w-9
                      h-9
                      rounded-full
                      bg-gray-50
                      flex
                      items-center
                      justify-center
                      group-hover:bg-[#FBBF24]/15
                      transition
                    "
                  >

                    <ArrowRight
                      size={17}
                      className="
                        text-gray-400
                        group-hover:text-[#14213D]
                        group-hover:translate-x-0.5
                        transition
                      "
                    />

                  </div>

                </div>

                <h3
                  className="
                    text-xl
                    font-heading
                    font-medium
                    text-[#14213D]
                    mb-3
                  "
                >
                  {service.title}
                </h3>

                <p
                  className="
                    text-gray-500
                    text-sm
                    leading-relaxed
                    mb-5
                  "
                >
                  {service.description}
                </p>

                <Link
                  to={service.link}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    text-sm
                    font-semibold
                    text-[#14213D]
                    hover:text-[#FBBF24]
                    transition
                  "
                >
                  Learn More
                  <ArrowRight size={15} />
                </Link>

              </div>
            )
          })}

        </div>

      </section>

      {/* =====================================================
          WHO WE HELP
      ===================================================== */}

      <section className="bg-[#14213D] py-20 md:py-24">

        <div className="max-w-7xl mx-auto px-4">

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-10
              items-center
            "
          >

            <div>

              <span
                className="
                  text-[#FBBF24]
                  font-semibold
                  text-sm
                  uppercase
                  tracking-wider
                "
              >
                Who We Help
              </span>

              <h2
                className="
                  text-white
                  text-3xl
                  md:text-4xl
                  font-heading
                  font-medium
                  mt-2
                  mb-5
                "
              >
                Property Solutions

                <span className="block">
                  for Everyone
                </span>
              </h2>

              <p
                className="
                  text-white/65
                  leading-relaxed
                  mb-7
                "
              >
                Every property journey is different.
                That's why we provide flexible services
                for buyers, sellers, landlords, and investors.
              </p>

              <Link
                to="/contact"
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-[#FBBF24]
                  text-black
                  font-semibold
                  px-6
                  py-3
                  rounded-full
                  hover:opacity-90
                  transition
                "
              >
                Talk to Our Team
                <ArrowRight size={17} />
              </Link>

            </div>

            <div
              className="
                lg:col-span-2
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-4
              "
            >

              {clients.map((client) => {

                const Icon = client.icon

                return (
                  <div
                    key={client.title}
                    className="
                      rounded-2xl
                      bg-white/5
                      border
                      border-white/10
                      p-6
                      hover:bg-white/10
                      hover:border-[#FBBF24]/40
                      transition
                    "
                  >

                    <div
                      className="
                        w-12
                        h-12
                        rounded-xl
                        bg-[#FBBF24]
                        flex
                        items-center
                        justify-center
                        mb-5
                      "
                    >

                      <Icon
                        size={22}
                        className="text-[#14213D]"
                      />

                    </div>

                    <h3
                      className="
                        text-white
                        text-lg
                        font-semibold
                        mb-2
                      "
                    >
                      {client.title}
                    </h3>

                    <p
                      className="
                        text-white/60
                        text-sm
                        leading-relaxed
                      "
                    >
                      {client.description}
                    </p>

                  </div>
                )
              })}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="bg-gray-50 py-20 md:py-24">

        <div className="max-w-7xl mx-auto px-4">

          <div
            className="
              text-center
              max-w-2xl
              mx-auto
              mb-16
            "
          >

            <span
              className="
                text-[#FBBF24]
                font-semibold
                text-sm
                uppercase
                tracking-wider
              "
            >
              Simple Process
            </span>

            <h2
              className="
                text-3xl
                md:text-4xl
                font-heading
                font-medium
                text-[#14213D]
                mt-2
                mb-4
              "
            >
              How It Works
            </h2>

            <p className="text-gray-500">
              A simple four-step process designed
              to make your property journey easier.
            </p>

          </div>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-8
            "
          >

            {steps.map((step, index) => {

              const Icon = step.icon

              return (
                <div
                  key={step.title}
                  className="relative text-center"
                >

                  {index < steps.length - 1 && (
                    <div
                      className="
                        hidden
                        lg:block
                        absolute
                        top-8
                        left-[60%]
                        w-[80%]
                        border-t-2
                        border-dashed
                        border-gray-200
                      "
                    />
                  )}

                  <div
                    className="
                      relative
                      z-10
                      w-16
                      h-16
                      mx-auto
                      rounded-full
                      bg-white
                      border-2
                      border-[#FBBF24]
                      flex
                      items-center
                      justify-center
                      mb-5
                      shadow-sm
                    "
                  >

                    <Icon
                      size={25}
                      className="text-[#14213D]"
                    />

                  </div>

                  <span
                    className="
                      text-[#FBBF24]
                      font-bold
                      text-xs
                      uppercase
                      tracking-wider
                    "
                  >
                    Step {step.number}
                  </span>

                  <h3
                    className="
                      text-xl
                      font-heading
                      font-medium
                      text-[#14213D]
                      mt-2
                      mb-2
                    "
                  >
                    {step.title}
                  </h3>

                  <p
                    className="
                      text-gray-500
                      text-sm
                      leading-relaxed
                      max-w-xs
                      mx-auto
                    "
                  >
                    {step.description}
                  </p>

                </div>
              )
            })}

          </div>

        </div>

      </section>

      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          py-20
          md:py-24
        "
      >

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-14
            items-center
          "
        >

          {/* LEFT */}

          <div>

            <span
              className="
                text-[#FBBF24]
                font-semibold
                text-sm
                uppercase
                tracking-wider
              "
            >
              Why Choose Us
            </span>

            <h2
              className="
                text-3xl
                md:text-4xl
                font-heading
                font-medium
                text-[#14213D]
                mt-2
                mb-5
              "
            >
              A Better Way to

              <span className="block">
                Navigate Real Estate
              </span>
            </h2>

            <p
              className="
                text-gray-500
                leading-relaxed
                mb-8
              "
            >
              We combine local property knowledge,
              professional service, and modern technology
              to create a simpler experience for buyers,
              sellers, renters, and investors.
            </p>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-5
              "
            >

              {benefits.map((benefit) => {

                const Icon = benefit.icon

                return (
                  <div
                    key={benefit.title}
                    className="
                      flex
                      items-start
                      gap-4
                    "
                  >

                    <div
                      className="
                        w-10
                        h-10
                        rounded-lg
                        bg-[#14213D]
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >

                      <Icon
                        size={19}
                        className="text-[#FBBF24]"
                      />

                    </div>

                    <div>

                      <h4
                        className="
                          font-semibold
                          text-[#14213D]
                          mb-1
                        "
                      >
                        {benefit.title}
                      </h4>

                      <p
                        className="
                          text-sm
                          text-gray-500
                          leading-relaxed
                        "
                      >
                        {benefit.description}
                      </p>

                    </div>

                  </div>
                )
              })}

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            <div
              className="
                rounded-3xl
                overflow-hidden
                h-[420px]
                shadow-xl
              "
            >

              <img
                src={servicesHero}
                alt="Ceylon Properties"
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#14213D]/80
                  via-transparent
                  to-transparent
                "
              />

            </div>

            {/* Floating card */}

            <div
              className="
                absolute
                -bottom-7
                left-5
                right-5
                sm:left-8
                sm:right-auto
                bg-white
                rounded-2xl
                shadow-xl
                p-5
                sm:w-80
                border
                border-gray-100
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mb-3
                "
              >

                <div
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-[#FBBF24]
                    flex
                    items-center
                    justify-center
                  "
                >

                  <ShieldCheck
                    size={22}
                    className="text-[#14213D]"
                  />

                </div>

                <div>

                  <p
                    className="
                      font-semibold
                      text-[#14213D]
                    "
                  >
                    Trusted Property Service
                  </p>

                </div>

              </div>

              <p
                className="
                  text-sm
                  text-gray-500
                  leading-relaxed
                "
              >
                Professional guidance and property
                solutions built around your needs.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section className="bg-gray-50 py-20 md:py-24">

        <div className="max-w-4xl mx-auto px-4">

          <div className="text-center mb-12">

            <span
              className="
                text-[#FBBF24]
                font-semibold
                text-sm
                uppercase
                tracking-wider
              "
            >
              FAQ
            </span>

            <h2
              className="
                text-3xl
                md:text-4xl
                font-heading
                font-medium
                text-[#14213D]
                mt-2
                mb-4
              "
            >
              Frequently Asked Questions
            </h2>

            <p className="text-gray-500">
              Everything you need to know about our services.
            </p>

          </div>

          <div className="space-y-3">

            {faqs.map((faq, index) => {

              const isOpen = openFaq === index

              return (
                <div
                  key={faq.question}
                  className="
                    bg-white
                    border
                    border-gray-200
                    rounded-xl
                    overflow-hidden
                  "
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(
                        isOpen ? null : index
                      )
                    }
                    className="
                      w-full
                      flex
                      items-center
                      justify-between
                      gap-4
                      text-left
                      px-5
                      py-5
                      hover:bg-gray-50
                      transition
                    "
                  >

                    <span
                      className="
                        font-semibold
                        text-[#14213D]
                      "
                    >
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={20}
                      className={`
                        shrink-0
                        text-[#14213D]
                        transition-transform
                        duration-300
                        ${isOpen ? 'rotate-180' : ''}
                      `}
                    />

                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5">

                      <p
                        className="
                          text-gray-500
                          text-sm
                          leading-relaxed
                          border-t
                          border-gray-100
                          pt-4
                        "
                      >
                        {faq.answer}
                      </p>

                    </div>
                  )}

                </div>
              )
            })}

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section
        className="
          bg-[#14213D]
          relative
          overflow-hidden
        "
      >

        {/* Decorative shapes */}

        <div
          className="
            absolute
            -top-24
            -right-24
            w-72
            h-72
            rounded-full
            border
            border-white/10
          "
        />

        <div
          className="
            absolute
            -bottom-32
            -left-20
            w-80
            h-80
            rounded-full
            border
            border-[#FBBF24]/10
          "
        />

        <div
          className="
            relative
            z-10
            max-w-4xl
            mx-auto
            px-4
            py-20
            md:py-24
            text-center
          "
        >

          <div
            className="
              w-14
              h-14
              mx-auto
              rounded-full
              bg-[#FBBF24]
              flex
              items-center
              justify-center
              mb-6
            "
          >

            <Home
              size={25}
              className="text-[#14213D]"
            />

          </div>

          <h2
            className="
              text-white
              text-4xl
              md:text-5xl
              mb-5
            "
            style={{
              fontFamily: 'var(--font-hero)',
            }}
          >
            Ready to Find Your

            <span className="block text-[#FBBF24]">
              Perfect Property?
            </span>
          </h2>

          <p
            className="
              text-white/70
              max-w-2xl
              mx-auto
              leading-relaxed
              mb-8
            "
          >
            Whether you're buying, selling, renting,
            or investing, our team is ready to help
            you take the next step.
          </p>

          <div
            className="
              flex
              flex-col
              sm:flex-row
              justify-center
              gap-3
            "
          >

            <Link
              to="/"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                bg-[#FBBF24]
                text-black
                font-semibold
                px-8
                py-3.5
                rounded-full
                hover:opacity-90
                transition
              "
            >
              Browse Properties
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/contact"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                border
                border-white/30
                text-white
                font-semibold
                px-8
                py-3.5
                rounded-full
                hover:bg-white
                hover:text-[#14213D]
                transition
              "
            >
              Contact Our Team
              <Phone size={18} />
            </Link>

          </div>

        </div>

      </section>

    </div>
  )
}

export default Services