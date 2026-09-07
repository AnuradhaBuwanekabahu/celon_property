import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  EyeOff,
  Database,
  Lock,
  UserCheck,
  Share2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import servicesHero from '../assets/hero/hero.jpeg'
import Loader from '../components/property/Loader.jsx'

function Privacy() {
  const [loading, setLoading] = useState(true)

  // =====================================================
  // INITIAL PAGE LOADER
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const privacyData = [
    {
      icon: EyeOff,
      title: 'Data Collection',
      content:
        'We collect personal information such as your name, email, and phone number when you register, make an inquiry, or list a property on Ceylon Properties.',
    },
    {
      icon: Database,
      title: 'Use of Information',
      content:
        'The information we collect is used to provide, maintain, and improve our services. We use it to communicate with you, process transactions, and personalize your experience.',
    },
    {
      icon: Lock,
      title: 'Data Security',
      points: [
        'Industry-standard encryption is used for data transmission',
        'We regularly review our data collection and storage practices',
        'Access to personal data is restricted to authorized employees',
      ],
    },
    {
      icon: Share2,
      title: 'Information Sharing',
      points: [
        'We do not sell your personal data to third parties',
        'Data may be shared with trusted service providers who assist us',
        'Information may be disclosed if required by law or to protect our rights',
      ],
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      points: [
        'You can request access to your personal data',
        'You have the right to request deletion of your information',
        'You can opt-out of marketing communications at any time',
      ],
    },
    {
      icon: ShieldCheck,
      title: 'Cookie Policy',
      content:
        'We use cookies and similar tracking technologies to track activity on our platform and hold certain information to enhance your browsing experience.',
    },
  ]

  // =====================================================
  // FULL-SCREEN LOADER
  // =====================================================

  if (loading) {
    return <Loader />
  }

  return (
    <div className="w-full bg-white overflow-hidden">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative
          h-[360px]
          md:h-[400px]
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

        <div className="absolute inset-0 bg-black/50" />

        {/* Decorative circles */}

        <div
          className="
            absolute
            top-16
            right-10
            w-40
            h-40
            rounded-full
            border
            border-white/10
            hidden
            lg:block
          "
        />

        <div
          className="
            absolute
            bottom-10
            left-10
            w-24
            h-24
            rounded-full
            border
            border-[#FBBF24]/20
            hidden
            lg:block
          "
        />

        {/* Hero Content */}

        <div
          className="
            relative
            z-10
            max-w-7xl
            mx-auto
            px-4
            w-full
            text-center
          "
        >

          <h1
            className="
              text-white
              text-4xl
              sm:text-5xl
              md:text-6xl
              leading-tight
              mb-4
            "
            style={{
              fontFamily: 'var(--font-hero)',
            }}
          >
            Privacy Policy
          </h1>

          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto">
            We value your privacy and are committed to
            protecting your personal data.
          </p>

        </div>

      </section>


      {/* =====================================================
          PRIVACY INTRODUCTION
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">

        <div
          className="
            bg-white
            rounded-2xl
            shadow-xl
            border
            border-gray-100
            p-6
            md:p-8
            flex
            flex-col
            md:flex-row
            items-center
            gap-5
          "
        >

          {/* Icon */}

          <div
            className="
              w-14
              h-14
              rounded-xl
              bg-[#14213D]
              flex
              items-center
              justify-center
              shrink-0
            "
          >

            <ShieldCheck
              size={26}
              className="text-[#FBBF24]"
            />

          </div>


          {/* Text */}

          <div className="text-center md:text-left">

            <h2 className="text-lg font-semibold text-[#14213D] mb-1">
              Your Information Is Important to Us
            </h2>

            <p className="text-sm text-gray-500 leading-relaxed">
              This Privacy Policy explains how Ceylon Properties
              collects, uses, protects, and handles your personal
              information when you use our platform.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          PRIVACY CONTENT
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-4 py-16">

        {/* Section Header */}

        <div className="text-center mb-12">

          <p className="text-[#FBBF24] font-medium text-sm uppercase tracking-wider mb-2">
            Privacy & Security
          </p>

          <h2
            className="
              text-3xl
              md:text-4xl
              text-[#14213D]
              mb-3
            "
            style={{
              fontFamily: 'var(--font-hero)',
            }}
          >
            How We Protect Your Data
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
            We believe in transparency. Learn how your information
            is collected, used, protected, and shared.
          </p>

        </div>


        {/* Privacy Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {privacyData.map((policy, index) => {

            const Icon = policy.icon

            return (
              <div
                key={policy.title}
                className="
                  group
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  p-7
                  md:p-8
                  hover:border-[#FBBF24]/60
                  hover:shadow-lg
                  transition-all
                  duration-300
                "
              >

                {/* Header */}

                <div className="flex items-start gap-4">

                  {/* Icon */}

                  <div className="shrink-0">

                    <div
                      className="
                        w-12
                        h-12
                        rounded-xl
                        bg-[#14213D]
                        flex
                        items-center
                        justify-center
                        group-hover:bg-[#FBBF24]
                        transition-colors
                        duration-300
                      "
                    >

                      <Icon
                        size={21}
                        className="
                          text-[#FBBF24]
                          group-hover:text-[#14213D]
                          transition-colors
                        "
                      />

                    </div>

                  </div>


                  {/* Title */}

                  <div className="flex-1">

                    <div className="flex items-center gap-2 mb-2">

                      <span className="text-xs font-semibold text-[#FBBF24]">
                        0{index + 1}
                      </span>

                      <span className="h-px w-6 bg-gray-200" />

                    </div>

                    <h3
                      className="
                        text-xl
                        font-heading
                        font-semibold
                        text-[#14213D]
                      "
                    >
                      {policy.title}
                    </h3>

                  </div>

                </div>


                {/* Content */}

                <div className="mt-5 ml-0 md:ml-16">

                  {policy.content && (
                    <p
                      className="
                        text-gray-600
                        text-sm
                        md:text-[15px]
                        leading-7
                      "
                    >
                      {policy.content}
                    </p>
                  )}


                  {policy.points && (
                    <ul className="space-y-3">

                      {policy.points.map((point, idx) => (

                        <li
                          key={idx}
                          className="
                            flex
                            items-start
                            gap-3
                            text-sm
                            md:text-[15px]
                            text-gray-600
                            leading-relaxed
                          "
                        >

                          <CheckCircle2
                            size={17}
                            className="
                              text-[#FBBF24]
                              shrink-0
                              mt-0.5
                            "
                          />

                          <span>
                            {point}
                          </span>

                        </li>

                      ))}

                    </ul>
                  )}

                </div>

              </div>
            )
          })}

        </div>

      </section>


      {/* =====================================================
          PRIVACY NOTICE
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-4 pb-16">

        <div
          className="
            bg-gray-50
            border
            border-gray-200
            rounded-2xl
            p-7
            md:p-9
            flex
            flex-col
            md:flex-row
            items-start
            md:items-center
            gap-5
          "
        >

          <div
            className="
              w-12
              h-12
              rounded-xl
              bg-[#14213D]
              flex
              items-center
              justify-center
              shrink-0
            "
          >

            <Lock
              size={21}
              className="text-[#FBBF24]"
            />

          </div>


          <div>

            <h3 className="text-[#14213D] font-semibold text-lg mb-1">
              We Respect Your Privacy
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed">
              Your personal information is handled responsibly
              and is used only for legitimate purposes related
              to our services and communication with you.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="bg-[#14213D]">

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            py-14
            md:py-16
            text-center
          "
        >

          <p className="text-[#FBBF24] text-sm font-medium mb-2">
            Have Questions?
          </p>

          <h2
            className="
              text-white
              text-3xl
              md:text-4xl
              mb-4
            "
            style={{
              fontFamily: 'var(--font-hero)',
            }}
          >
            We're Here to Help
          </h2>

          <p className="text-white/70 max-w-xl mx-auto mb-7 text-sm md:text-base">
            If you have questions about how we handle your
            personal information, feel free to contact our team.
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
              px-7
              py-3.5
              rounded-full
              hover:bg-[#FBBF24]/90
              transition
            "
          >
            Contact Us
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </div>
  )
}

export default Privacy