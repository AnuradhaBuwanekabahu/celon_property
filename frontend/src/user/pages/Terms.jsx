import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  FileText,
  CheckCircle2,
  ShieldAlert,
  ScrollText,
  CreditCard,
  UserCircle,
} from 'lucide-react'

import servicesHero from '../assets/hero/hero.jpeg'
import Loader from '../components/property/Loader.jsx'

function Terms() {
  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Small delay so the Loader is shown while the page loads
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // =====================================================
  // TERMS DATA
  // =====================================================

  const termsData = [
    {
      icon: FileText,
      title: 'Introduction',
      content:
        'By using Ceylon Properties services, you agree to comply with these Terms & Conditions. Please read them carefully before using any service.',
    },
    {
      icon: CheckCircle2,
      title: 'Property Listings',
      content:
        'All property details, prices, and availability are subject to change without notice. We strive to provide accurate information, but we do not guarantee the completeness or accuracy of any listing.',
    },
    {
      icon: CreditCard,
      title: 'Payments & Fees',
      points: [
        'Full or partial payment may be required to confirm services',
        'Payments must be made through approved methods only',
        'Prices may change without prior notice',
      ],
    },
    {
      icon: ScrollText,
      title: 'Listing Policy',
      points: [
        'Images shown must be authentic and accurately represent the property',
        'Fake or misleading listings will be permanently removed',
        'Users must verify property legalities before any transaction',
      ],
    },
    {
      icon: UserCircle,
      title: 'User Responsibilities',
      points: [
        'Provide accurate personal and contact information',
        'Maintain confidentiality of your account credentials',
        'Do not engage in fraudulent activities on the platform',
      ],
    },
    {
      icon: ShieldAlert,
      title: 'Liability',
      content:
        'Ceylon Properties is not responsible for personal loss, injury, delays, or damages caused during property transactions or visits due to unforeseen circumstances.',
    },
  ]

  // =====================================================
  // PAGE LOADER
  // =====================================================

  if (loading) {
    return (
     
        <Loader />
     
    )
  }

  // =====================================================
  // PAGE
  // =====================================================

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
            Terms & Conditions
          </h1>

          <p
            className="
              text-white/90
              text-base
              md:text-lg
              max-w-2xl
              mx-auto
            "
          >
            Please read these terms carefully before using
            Ceylon Properties and its services.
          </p>

        </div>

      </section>

      {/* =====================================================
          INTRODUCTION BAR
      ===================================================== */}

      <section
        className="
          max-w-6xl
          mx-auto
          px-4
          -mt-8
          relative
          z-20
        "
      >

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

            <FileText
              size={25}
              className="text-[#FBBF24]"
            />

          </div>

          <div
            className="
              text-center
              md:text-left
            "
          >

            <h2
              className="
                text-lg
                font-semibold
                text-[#14213D]
                mb-1
              "
            >
              Please Review Before Using Our Platform
            </h2>

            <p
              className="
                text-sm
                text-gray-500
                leading-relaxed
              "
            >
              These terms explain the rules and responsibilities
              that apply when using Ceylon Properties services.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          TERMS CONTENT
      ===================================================== */}

      <section
        className="
          max-w-6xl
          mx-auto
          px-4
          py-16
        "
      >

        {/* Section Header */}

        <div className="text-center mb-12">

          <p
            className="
              text-[#FBBF24]
              font-medium
              text-sm
              uppercase
              tracking-wider
              mb-2
            "
          >
            Our Policies
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
            Terms of Service
          </h2>

          <p
            className="
              text-gray-500
              max-w-2xl
              mx-auto
              text-sm
              md:text-base
            "
          >
            Understanding these guidelines helps us maintain
            a safe, transparent, and reliable property platform
            for everyone.
          </p>

        </div>

        {/* Terms Grid */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
        >

          {termsData.map((term, index) => {

            const Icon = term.icon

            return (
              <div
                key={term.title}
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

                {/* Top Row */}

                <div
                  className="
                    flex
                    items-start
                    gap-4
                  "
                >

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

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        mb-2
                      "
                    >

                      <span
                        className="
                          text-xs
                          font-semibold
                          text-[#FBBF24]
                        "
                      >
                        0{index + 1}
                      </span>

                      <span
                        className="
                          h-px
                          w-6
                          bg-gray-200
                        "
                      />

                    </div>

                    <h3
                      className="
                        text-xl
                        font-heading
                        font-semibold
                        text-[#14213D]
                      "
                    >
                      {term.title}
                    </h3>

                  </div>

                </div>

                {/* Content */}

                <div
                  className="
                    mt-5
                    ml-0
                    md:ml-16
                  "
                >

                  {term.content && (

                    <p
                      className="
                        text-gray-600
                        text-sm
                        md:text-[15px]
                        leading-7
                      "
                    >
                      {term.content}
                    </p>

                  )}

                  {term.points && (

                    <ul className="space-y-3">

                      {term.points.map(
                        (point, idx) => (

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

                        )
                      )}

                    </ul>

                  )}

                </div>

              </div>
            )
          })}

        </div>

      </section>

      {/* =====================================================
          NOTICE
      ===================================================== */}

      <section
        className="
          max-w-6xl
          mx-auto
          px-4
          pb-16
        "
      >

        <div
          className="
            bg-[#14213D]
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
              bg-[#FBBF24]
              flex
              items-center
              justify-center
              shrink-0
            "
          >

            <ShieldAlert
              size={22}
              className="text-[#14213D]"
            />

          </div>

          <div>

            <h3
              className="
                text-white
                font-semibold
                text-lg
                mb-1
              "
            >
              Important Notice
            </h3>

            <p
              className="
                text-white/70
                text-sm
                leading-relaxed
              "
            >
              By continuing to use our platform, you acknowledge
              that you have read and agreed to these Terms &
              Conditions.
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

          <p
            className="
              text-[#FBBF24]
              text-sm
              font-medium
              mb-2
            "
          >
            Need More Information?
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

          <p
            className="
              text-white/70
              max-w-xl
              mx-auto
              mb-7
              text-sm
              md:text-base
            "
          >
            If you have questions about our terms, services,
            or property transactions, our team is ready to assist you.
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

export default Terms