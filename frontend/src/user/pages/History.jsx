import { useState, useEffect } from 'react'
import {
  Flag,
  Trophy,
  Target,
  HeartHandshake,
  Map,
  Star,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import servicesHero from '../assets/hero/hero.jpeg'
import Loader from '../components/property/Loader.jsx'

function History() {
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
  // HISTORY DATA
  // =====================================================

  const historyData = [
    {
      icon: Flag,
      title: 'Our Beginnings',
      content:
        'Founded with a vision to revolutionize the Sri Lankan real estate market, Ceylon Properties started as a small, passionate team dedicated to making property transactions transparent, seamless, and trustworthy.',
    },
    {
      icon: Target,
      title: 'The Mission',
      content:
        'From day one, our mission has been clear: to connect buyers, sellers, and renters through a modern platform that prioritizes user experience, verified listings, and exceptional customer service.',
    },
    {
      icon: Map,
      title: 'Expanding Horizons',
      points: [
        'Started in Colombo and quickly expanded to major cities',
        'Grew our portfolio to include commercial and luxury properties',
        'Established partnerships with top developers across the island',
      ],
    },
    {
      icon: HeartHandshake,
      title: 'Community Trust',
      points: [
        'Built a network of thousands of satisfied clients',
        'Pioneered strict verification processes for all listings',
        'Created a dedicated 24/7 support system for all users',
      ],
    },
    {
      icon: Trophy,
      title: 'Milestones Achieved',
      points: [
        'Over 12,000 active property listings on the platform',
        'Recognized as a leading real estate platform in Sri Lanka',
        'Successfully facilitated over 8,000 successful property matches',
      ],
    },
    {
      icon: Star,
      title: 'Looking Forward',
      content:
        'As we look to the future, we continue to innovate. We are integrating advanced technologies and expanding our services to remain the most trusted name in Sri Lankan real estate.',
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
          md:h-[420px]
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

        <div
          className="
            absolute
            top-10
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
              text-5xl
              md:text-6xl
              leading-tight
              mb-4
            "
            style={{
              fontFamily: 'var(--font-hero)',
            }}
          >
            Our History
          </h1>

          <p
            className="
              text-white/90
              text-base
              md:text-lg
              max-w-2xl
              mx-auto
              leading-relaxed
            "
          >
            Discover the journey of Ceylon Properties and
            how we continue to build trust in Sri Lankan
            real estate.
          </p>

        </div>

      </section>

      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 py-16">

        <div className="max-w-3xl mx-auto text-center">

          <span
            className="
              inline-flex
              items-center
              gap-2
              text-[#14213D]
              text-sm
              font-semibold
              mb-4
            "
          >
            <span className="w-8 h-px bg-[#FBBF24]" />

            OUR STORY

            <span className="w-8 h-px bg-[#FBBF24]" />
          </span>

          <h2
            className="
              text-3xl
              md:text-4xl
              font-heading
              font-medium
              text-[#14213D]
              mb-5
            "
          >
            Building a Better Property Experience
          </h2>

          <p className="text-gray-500 leading-relaxed">
            What began with a simple vision has grown into a
            modern property platform focused on transparency,
            convenience, and trust. Every milestone represents
            our commitment to helping people find the right
            property with confidence.
          </p>

        </div>

      </section>

      {/* =====================================================
          HISTORY TIMELINE
      ===================================================== */}

      <section className="bg-gray-50 py-16">

        <div className="max-w-6xl mx-auto px-4">

          <div className="text-center mb-14">

            <p className="text-[#FBBF24] font-semibold text-sm mb-2">
              OUR JOURNEY
            </p>

            <h2
              className="
                text-3xl
                md:text-4xl
                font-heading
                font-medium
                text-[#14213D]
                mb-3
              "
            >
              From Vision to Reality
            </h2>

            <p className="text-gray-500 max-w-xl mx-auto">
              A journey shaped by innovation, trust, and
              our commitment to the property community.
            </p>

          </div>

          <div className="relative">

            {/* Timeline Line */}

            <div
              className="
                absolute
                left-5
                md:left-1/2
                top-0
                bottom-0
                w-px
                bg-gray-200
                md:-translate-x-1/2
              "
            />

            <div className="space-y-10">

              {historyData.map((item, index) => {

                const Icon = item.icon
                const isRight = index % 2 !== 0

                return (
                  <div
                    key={index}
                    className="
                      relative
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      gap-8
                      md:gap-16
                    "
                  >

                    {/* Timeline Icon */}

                    <div
                      className="
                        absolute
                        left-5
                        md:left-1/2
                        top-6
                        -translate-x-1/2
                        w-11
                        h-11
                        rounded-full
                        bg-[#14213D]
                        border-4
                        border-gray-50
                        flex
                        items-center
                        justify-center
                        z-10
                      "
                    >

                      <Icon
                        size={18}
                        className="text-[#FBBF24]"
                      />

                    </div>

                    {/* LEFT SIDE */}

                    {!isRight ? (
                      <div className="md:pr-8 pl-16 md:pl-0">

                        <div
                          className="
                            bg-white
                            rounded-2xl
                            p-7
                            border
                            border-gray-200
                            shadow-sm
                            hover:shadow-lg
                            transition
                          "
                        >

                          <div className="flex items-center gap-3 mb-5">

                            <div
                              className="
                                w-11
                                h-11
                                rounded-xl
                                bg-[#14213D]
                                flex
                                items-center
                                justify-center
                                shrink-0
                              "
                            >

                              <Icon
                                size={21}
                                className="text-[#FBBF24]"
                              />

                            </div>

                            <div>

                              <span
                                className="
                                  text-xs
                                  font-semibold
                                  text-[#FBBF24]
                                  uppercase
                                  tracking-wider
                                "
                              >
                                Chapter {index + 1}
                              </span>

                              <h3
                                className="
                                  text-xl
                                  font-heading
                                  font-medium
                                  text-[#14213D]
                                "
                              >
                                {item.title}
                              </h3>

                            </div>

                          </div>

                          {item.content && (
                            <p
                              className="
                                text-gray-500
                                text-sm
                                leading-relaxed
                              "
                            >
                              {item.content}
                            </p>
                          )}

                          {item.points && (
                            <ul className="space-y-3">

                              {item.points.map((point, idx) => (
                                <li
                                  key={idx}
                                  className="
                                    flex
                                    items-start
                                    gap-3
                                    text-sm
                                    text-gray-500
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
                    ) : (
                      <div className="hidden md:block" />
                    )}

                    {/* RIGHT SIDE */}

                    {isRight ? (
                      <div className="md:pl-8 pl-16">

                        <div
                          className="
                            bg-white
                            rounded-2xl
                            p-7
                            border
                            border-gray-200
                            shadow-sm
                            hover:shadow-lg
                            transition
                          "
                        >

                          <div className="flex items-center gap-3 mb-5">

                            <div
                              className="
                                w-11
                                h-11
                                rounded-xl
                                bg-[#14213D]
                                flex
                                items-center
                                justify-center
                                shrink-0
                              "
                            >

                              <Icon
                                size={21}
                                className="text-[#FBBF24]"
                              />

                            </div>

                            <div>

                              <span
                                className="
                                  text-xs
                                  font-semibold
                                  text-[#FBBF24]
                                  uppercase
                                  tracking-wider
                                "
                              >
                                Chapter {index + 1}
                              </span>

                              <h3
                                className="
                                  text-xl
                                  font-heading
                                  font-medium
                                  text-[#14213D]
                                "
                              >
                                {item.title}
                              </h3>

                            </div>

                          </div>

                          {item.content && (
                            <p
                              className="
                                text-gray-500
                                text-sm
                                leading-relaxed
                              "
                            >
                              {item.content}
                            </p>
                          )}

                          {item.points && (
                            <ul className="space-y-3">

                              {item.points.map((point, idx) => (
                                <li
                                  key={idx}
                                  className="
                                    flex
                                    items-start
                                    gap-3
                                    text-sm
                                    text-gray-500
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
                    ) : (
                      <div className="hidden md:block" />
                    )}

                  </div>
                )
              })}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MILESTONE STATS
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 py-16">

        <div className="text-center mb-10">

          <p className="text-[#FBBF24] font-semibold text-sm mb-2">
            OUR ACHIEVEMENTS
          </p>

          <h2
            className="
              text-3xl
              md:text-4xl
              font-heading
              font-medium
              text-[#14213D]
            "
          >
            Growing With Our Community
          </h2>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

          <div
            className="
              bg-[#14213D]
              rounded-2xl
              p-6
              md:p-8
              text-center
              text-white
            "
          >

            <p className="text-3xl md:text-4xl font-bold mb-2">
              12K+
            </p>

            <p className="text-sm text-white/70">
              Properties Listed
            </p>

          </div>

          <div
            className="
              bg-[#FBBF24]
              rounded-2xl
              p-6
              md:p-8
              text-center
              text-black
            "
          >

            <p className="text-3xl md:text-4xl font-bold mb-2">
              8K+
            </p>

            <p className="text-sm">
              Property Matches
            </p>

          </div>

          <div
            className="
              bg-[#FBBF24]
              rounded-2xl
              p-6
              md:p-8
              text-center
              text-black
            "
          >

            <p className="text-3xl md:text-4xl font-bold mb-2">
              15+
            </p>

            <p className="text-sm">
              Years Experience
            </p>

          </div>

          <div
            className="
              bg-[#14213D]
              rounded-2xl
              p-6
              md:p-8
              text-center
              text-white
            "
          >

            <p className="text-3xl md:text-4xl font-bold mb-2">
              24/7
            </p>

            <p className="text-sm text-white/70">
              Client Support
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          FUTURE CTA
      ===================================================== */}

      <section className="bg-[#14213D]">

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            py-16
            text-center
          "
        >

          <div
            className="
              w-14
              h-14
              rounded-full
              bg-[#FBBF24]/15
              flex
              items-center
              justify-center
              mx-auto
              mb-5
            "
          >

            <Star
              size={25}
              className="text-[#FBBF24]"
              fill="currentColor"
            />

          </div>

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
            Be Part of Our Journey
          </h2>

          <p
            className="
              text-white/70
              max-w-xl
              mx-auto
              mb-8
              leading-relaxed
            "
          >
            Whether you're looking for your next home,
            selling a property, or making an investment,
            we're here to help you move forward.
          </p>

          <Link
            to="/"
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
              hover:opacity-90
              transition
            "
          >
            Explore Properties
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </div>
  )
}

export default History