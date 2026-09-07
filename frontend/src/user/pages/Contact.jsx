import { useEffect, useState } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Lock,
  ArrowRight,
  Navigation,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import contactHero from '../assets/hero/hero.jpeg'
import Loader from '../components/property/Loader.jsx'

function Contact() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [sending, setSending] = useState(false)

  // =====================================================
  // INITIAL PAGE LOADER
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      setUser(null)
      return
    }

    try {
      const userData = JSON.parse(storedUser)

      setUser(userData)

      setFormData({
        name:
          userData.full_name ||
          userData.name ||
          userData.Name ||
          '',

        email:
          userData.email ||
          '',

        phone:
          userData.phone_number ||
          userData.phone ||
          userData.contact_number ||
          '',

        message: '',
      })
    } catch (error) {
      console.error(
        'Failed to read logged-in user:',
        error
      )

      setUser(null)
    }
  }, [])

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      alert('Please login to send a message.')

      navigate('/login')

      return
    }

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      alert('Please fill all fields.')
      return
    }

    try {
      setSending(true)

      const contactData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      }

      console.log('Contact message:', contactData)

      // =================================================
      // SEND TO BACKEND HERE
      // =================================================

      // await sendContactMessage(contactData)

      alert('Your message has been sent successfully!')

      setFormData((prev) => ({
        ...prev,
        message: '',
      }))
    } catch (error) {
      console.error(
        'Failed to send message:',
        error
      )

      alert(
        'Failed to send message. Please try again.'
      )
    } finally {
      setSending(false)
    }
  }

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
          h-[380px]
          md:h-[420px]
          bg-cover
          bg-center
          flex
          flex-col
          justify-center
        "
        style={{
          backgroundImage: `url(${contactHero})`,
        }}
      >

        {/* Overlay */}

        <div className="absolute inset-0 bg-black/45" />

        {/* Hero Content */}

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

          <p className="text-secondary text-lg mb-2">
            We're Here To Help
          </p>

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
            Contact Us
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
            Have a question about a property or need
            guidance? Reach out and our team will get
            back to you shortly.
          </p>

        </div>

      </section>


      {/* =====================================================
          CONTACT INFORMATION
      ===================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          -mt-10
          relative
          z-10
        "
      >

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-5
          "
        >

          {/* =================================================
              VISIT US
          ================================================= */}

          <div
            className="
              group
              bg-white
              rounded-2xl
              shadow-lg
              border
              border-gray-100
              p-7
              text-center
              hover:-translate-y-1
              hover:shadow-xl
              transition
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
                mx-auto
                mb-5
                group-hover:bg-[#FBBF24]
                transition
              "
            >

              <MapPin
                size={24}
                className="
                  text-[#FBBF24]
                  group-hover:text-[#14213D]
                  transition
                "
              />

            </div>

            <h3
              className="
                font-heading
                font-medium
                text-lg
                mb-2
              "
            >
              Visit Us
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed">
              No. 24, Marine Drive,
              <br />
              Colombo 03, Sri Lanka
            </p>

          </div>


          {/* =================================================
              CALL US
          ================================================= */}

          <div
            className="
              group
              bg-white
              rounded-2xl
              shadow-lg
              border
              border-gray-100
              p-7
              text-center
              hover:-translate-y-1
              hover:shadow-xl
              transition
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
                mx-auto
                mb-5
                group-hover:bg-[#FBBF24]
                transition
              "
            >

              <Phone
                size={24}
                className="
                  text-[#FBBF24]
                  group-hover:text-[#14213D]
                  transition
                "
              />

            </div>

            <h3
              className="
                font-heading
                font-medium
                text-lg
                mb-2
              "
            >
              Call Us
            </h3>

            <div className="space-y-1">

              <a
                href="tel:+94112345678"
                className="
                  block
                  text-gray-500
                  text-sm
                  hover:text-[#14213D]
                  transition
                "
              >
                +94 11 234 5678
              </a>

              <a
                href="tel:+94778888888"
                className="
                  block
                  text-gray-500
                  text-sm
                  hover:text-[#14213D]
                  transition
                "
              >
                +94 77 888 8888
              </a>

            </div>

          </div>


          {/* =================================================
              EMAIL US
          ================================================= */}

          <div
            className="
              group
              bg-white
              rounded-2xl
              shadow-lg
              border
              border-gray-100
              p-7
              text-center
              hover:-translate-y-1
              hover:shadow-xl
              transition
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
                mx-auto
                mb-5
                group-hover:bg-[#FBBF24]
                transition
              "
            >

              <Mail
                size={24}
                className="
                  text-[#FBBF24]
                  group-hover:text-[#14213D]
                  transition
                "
              />

            </div>

            <h3
              className="
                font-heading
                font-medium
                text-lg
                mb-2
              "
            >
              Email Us
            </h3>

            <div className="space-y-1">

              <a
                href="mailto:info@ceylonproperties.lk"
                className="
                  block
                  text-gray-500
                  text-sm
                  hover:text-[#14213D]
                  transition
                "
              >
                info@ceylonproperties.lk
              </a>

              <a
                href="mailto:support@ceylonproperties.lk"
                className="
                  block
                  text-gray-500
                  text-sm
                  hover:text-[#14213D]
                  transition
                "
              >
                support@ceylonproperties.lk
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT + MAP
      ===================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          py-20
        "
      >

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-12
            items-start
          "
        >

          {/* =================================================
              CONTACT FORM
          ================================================= */}

          <div>

            <div className="mb-8">

              <span
                className="
                  inline-block
                  text-[#FBBF24]
                  font-semibold
                  text-sm
                  uppercase
                  tracking-wide
                  mb-2
                "
              >
                Get In Touch
              </span>

              <h2
                className="
                  text-3xl
                  md:text-4xl
                  mb-3
                  text-[#14213D]
                "
                style={{
                  fontFamily: 'var(--font-hero)',
                }}
              >
                Send Us a Message
              </h2>

              <p
                className="
                  text-gray-500
                  leading-relaxed
                  max-w-xl
                "
              >
                Have a question, need property advice,
                or want to learn more about one of our
                listings? Our team is ready to help.
              </p>

            </div>


            {/* =================================================
                NOT LOGGED IN
            ================================================= */}

            {!user ? (

              <div
                className="
                  border
                  border-gray-200
                  rounded-2xl
                  bg-gray-50
                  p-8
                  md:p-10
                  text-center
                "
              >

                <div
                  className="
                    w-16
                    h-16
                    mx-auto
                    mb-5
                    rounded-full
                    bg-[#14213D]
                    flex
                    items-center
                    justify-center
                  "
                >

                  <Lock
                    size={25}
                    className="text-[#FBBF24]"
                  />

                </div>

                <h3
                  className="
                    text-xl
                    font-semibold
                    text-[#14213D]
                    mb-2
                  "
                >
                  Login Required
                </h3>

                <p
                  className="
                    text-gray-500
                    text-sm
                    max-w-md
                    mx-auto
                    mb-7
                    leading-relaxed
                  "
                >
                  Please login to your account before
                  sending a message to our team.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    justify-center
                    bg-[#14213D]
                    text-white
                    font-semibold
                    px-7
                    py-3
                    rounded-full
                    hover:opacity-90
                    transition
                  "
                >
                  Login to Continue
                  <ArrowRight size={17} />
                </button>

              </div>

            ) : (

              /* =================================================
                  LOGGED-IN FORM
              ================================================= */

              <form
                onSubmit={handleSubmit}
                className="
                  border
                  border-gray-200
                  rounded-2xl
                  p-6
                  md:p-8
                  shadow-sm
                "
              >

                {/* User information */}

                <div
                  className="
                    flex
                    items-center
                    gap-4
                    bg-gray-50
                    border
                    border-gray-200
                    rounded-xl
                    p-4
                    mb-6
                  "
                >

                  <div
                    className="
                      w-11
                      h-11
                      rounded-full
                      bg-[#14213D]
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >

                    <span
                      className="
                        text-[#FBBF24]
                        font-bold
                      "
                    >
                      {(formData.name || 'U')
                        .charAt(0)
                        .toUpperCase()}
                    </span>

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-gray-900">
                      {formData.name || 'Logged-in User'}
                    </p>

                  </div>

                </div>


                {/* Name + Phone */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-5
                    mb-5
                  "
                >

                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="
                        w-full
                        border
                        border-gray-300
                        rounded-lg
                        px-4
                        py-3
                        outline-none
                        focus:border-[#14213D]
                        focus:ring-2
                        focus:ring-[#14213D]/10
                        transition
                      "
                    />

                  </div>


                  <div>

                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="07X XXX XXXX"
                      required
                      className="
                        w-full
                        border
                        border-gray-300
                        rounded-lg
                        px-4
                        py-3
                        outline-none
                        focus:border-[#14213D]
                        focus:ring-2
                        focus:ring-[#14213D]/10
                        transition
                      "
                    />

                  </div>

                </div>


                {/* Email */}

                <div className="mb-5">

                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      focus:border-[#14213D]
                      focus:ring-2
                      focus:ring-[#14213D]/10
                      transition
                    "
                  />

                </div>


                {/* Message */}

                <div className="mb-6">

                  <label className="block text-sm font-medium mb-2">
                    Message
                  </label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    placeholder="How can we help you?"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      focus:border-[#14213D]
                      focus:ring-2
                      focus:ring-[#14213D]/10
                      resize-none
                      transition
                    "
                  />

                </div>


                {/* Submit */}

                <button
                  type="submit"
                  disabled={sending}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    bg-[#14213D]
                    text-white
                    font-semibold
                    px-8
                    py-3.5
                    rounded-full
                    hover:opacity-90
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >

                  <Send size={17} />

                  {sending
                    ? 'Sending...'
                    : 'Send Message'}

                </button>


                <p
                  className="
                    text-xs
                    text-gray-400
                    mt-4
                  "
                >
                  Your contact information will be used
                  only to respond to your inquiry.
                </p>

              </form>

            )}

          </div>


          {/* =================================================
              MAP + OFFICE HOURS
          ================================================= */}

          <div>

            {/* MAP */}

            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                shadow-sm
                h-[380px]
              "
            >

              <iframe
                title="Ceylon Properties Office Location"
                src="https://www.google.com/maps?q=No.%2024,%20Marine%20Drive,%20Colombo%2003,%20Sri%20Lanka&output=embed"
                className="
                  w-full
                  h-full
                  border-0
                "
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Map Address Card */}

              <div
                className="
                  absolute
                  bottom-4
                  left-4
                  right-4
                  bg-white
                  rounded-xl
                  shadow-lg
                  p-4
                "
              >

                <div className="flex items-start gap-3">

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

                    <Navigation
                      size={18}
                      className="text-[#FBBF24]"
                    />

                  </div>

                  <div>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-[#14213D]
                        mb-1
                      "
                    >
                      Ceylon Properties
                    </p>

                    <p className="text-xs text-gray-500">
                      No. 24, Marine Drive,
                      Colombo 03, Sri Lanka
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* OFFICE HOURS */}

            <div
              className="
                bg-gray-50
                rounded-2xl
                p-6
                mt-6
                border
                border-gray-100
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mb-5
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
                  "
                >

                  <Clock
                    size={19}
                    className="text-[#FBBF24]"
                  />

                </div>

                <div>

                  <h3
                    className="
                      font-heading
                      font-medium
                      text-lg
                    "
                  >
                    Office Hours
                  </h3>

                </div>

              </div>


              <div className="space-y-3">

                <div
                  className="
                    flex
                    justify-between
                    items-center
                    text-sm
                    text-gray-600
                    border-b
                    border-gray-200
                    pb-3
                  "
                >

                  <span>
                    Monday - Friday
                  </span>

                  <span className="font-medium text-[#14213D]">
                    8:30 AM - 6:00 PM
                  </span>

                </div>


                <div
                  className="
                    flex
                    justify-between
                    items-center
                    text-sm
                    text-gray-600
                    border-b
                    border-gray-200
                    pb-3
                  "
                >

                  <span>
                    Saturday
                  </span>

                  <span className="font-medium text-[#14213D]">
                    9:00 AM - 4:00 PM
                  </span>

                </div>


                <div
                  className="
                    flex
                    justify-between
                    items-center
                    text-sm
                    text-gray-600
                  "
                >

                  <span>
                    Sunday
                  </span>

                  <span className="font-medium text-gray-400">
                    Closed
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <section className="bg-[#14213D]">

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            py-14
            text-center
          "
        >

          <p className="text-[#FBBF24] text-sm font-semibold mb-2">
            Need Property Assistance?
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
            Let's Find the Right Property for You
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
            Explore our available properties and discover
            homes, lands, and investment opportunities
            across Sri Lanka.
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
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
          </button>

        </div>

      </section>

    </div>
  )
}

export default Contact