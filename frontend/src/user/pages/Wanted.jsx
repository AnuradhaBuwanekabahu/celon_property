import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  MapPin,
  Wallet,
  Phone,
  Plus,
  X,
} from 'lucide-react'

import { getWanted, addWanted } from '../Routers/wantedApi'
import Loader from '../components/property/Loader.jsx'


function formatAge(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  const daysAgo = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
  )

  if (daysAgo === 0) return 'Today'
  if (daysAgo === 1) return '1 day ago'
  return `${daysAgo} days ago`
}

function Wanted() {

  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [user, setUser] = useState(null)
  const [accountType, setAccountType] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    preferred_city: '',
    phone_number: '',
  })
  const [checkingUser, setCheckingUser] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user')
      const savedClient = localStorage.getItem('client')
      const activeUser = savedUser ? JSON.parse(savedUser) : null
      const activeClient = savedClient ? JSON.parse(savedClient) : null
      const account = activeUser || activeClient

      if (account) {
        const accountId = Number(account.id)
        const type = activeUser ? 'user' : 'client'
        if (Number.isInteger(accountId) && accountId > 0) {
          setAccountType(type)
          setUser({ ...account, id: accountId, type })
        }
      }
    } catch (err) {
      console.error('Unable to load saved account:', err)
      localStorage.removeItem('user')
      localStorage.removeItem('client')
      localStorage.removeItem('userToken')
      localStorage.removeItem('clientToken')
      localStorage.removeItem('token')
    } finally {
      setCheckingUser(false)
    }
  }, [])

  const fetchWanted = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getWanted()
      setRequests(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Get wanted error:', err)
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load wanted requests'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!checkingUser) fetchWanted()
  }, [checkingUser])


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target


    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

  }


  // =====================================================
  // OPEN ADD WANTED FORM
  // =====================================================

  const handleAddWanted = () => {

    // ---------------------------------------------------
    // LOGIN REQUIRED
    // ---------------------------------------------------

    if (!user?.id) {

      navigate(
        '/user-login?redirect=/wanted',
        {
          replace: true,
        }
      )

      return
    }


    setFormError(null)


    setFormData({
      title: '',
      description: '',
      budget: '',
      preferred_city: '',
      phone_number: '',
    })


    setShowForm(true)

  }


  // =====================================================
  // SUBMIT WANTED
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault()

    setFormError(null)


    // ---------------------------------------------------
    // LOGIN CHECK
    // ---------------------------------------------------

    if (!user?.id) {

      navigate(
        '/user-login?redirect=/wanted',
        {
          replace: true,
        }
      )

      return
    }


    // ---------------------------------------------------
    // TITLE VALIDATION
    // ---------------------------------------------------

    if (!formData.title.trim()) {

      setFormError(
        'Please enter a title.'
      )

      return
    }


    // ---------------------------------------------------
    // CITY VALIDATION
    // ---------------------------------------------------

    if (!formData.preferred_city.trim()) {

      setFormError(
        'Please enter your preferred city.'
      )

      return
    }


    // ---------------------------------------------------
    // PHONE VALIDATION
    // ---------------------------------------------------

    if (!formData.phone_number.trim()) {

      setFormError(
        'Please enter your contact number.'
      )

      return
    }

    setSubmitting(true)


    try {

      // ===============================================
      // FORM DATA
      // ===============================================

      const payload =
        new FormData()


      // ===============================================
      // ACCOUNT ID
      // ===============================================

      if (accountType === 'client') {

        payload.append(
          'client_id',
          String(user.id)
        )

      } else {

        payload.append(
          'user_id',
          String(user.id)
        )

      }


      // ===============================================
      // TITLE
      // ===============================================

      payload.append(
        'title',
        formData.title.trim()
      )


      // ===============================================
      // DESCRIPTION
      // ===============================================

      payload.append(
        'description',
        formData.description.trim()
      )


      // ===============================================
      // BUDGET
      // ===============================================

      payload.append(
        'budget',
        formData.budget
      )


      // ===============================================
      // PREFERRED CITY
      // ===============================================

      payload.append(
        'preferred_city',
        formData.preferred_city.trim()
      )


      // ===============================================
      // PHONE NUMBER
      // ===============================================

      payload.append(
        'phone_number',
        formData.phone_number.trim()
      )

      // ===============================================
      // SEND TO BACKEND
      // ===============================================

      await addWanted(payload)


      // ===============================================
      // REFRESH LIST
      // ===============================================

      await fetchWanted()


      // ===============================================
      // CLOSE MODAL
      // ===============================================

      setShowForm(false)


      // ===============================================
      // RESET FORM
      // ===============================================

      setFormData({
        title: '',
        description: '',
        budget: '',
        preferred_city: '',
        phone_number: '',
      })

    } catch (err) {

      console.error(
        'Add wanted error:',
        err
      )


      // ===============================================
      // AUTH ERROR
      // ===============================================

      if (
        err?.response?.status === 401 ||
        err?.response?.status === 403 ||
        err?.message?.includes(
          'Please log in'
        )
      ) {

        localStorage.removeItem('userToken')
        localStorage.removeItem('clientToken')
        localStorage.removeItem('token')

        localStorage.removeItem('user')
        localStorage.removeItem('client')


        navigate(
          '/user-login?redirect=/wanted',
          {
            replace: true,
          }
        )

        return
      }


      // ===============================================
      // OTHER ERROR
      // ===============================================

      setFormError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to submit wanted request'
      )

    } finally {

      setSubmitting(false)

    }

  }


  // =====================================================
  // FULL SCREEN LOADER
  // =====================================================

  /*
    First check the login state.

    Loader.jsx should use:

    fixed inset-0 z-[9999]

    so it covers the complete viewport.
  */

  if (checkingUser) {
    return <Loader />
  }


  // =====================================================
  // WANTED DATA LOADER
  // =====================================================

  if (loading) {
    return <Loader />
  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div
      className="
        max-w-7xl
        mx-auto
        px-4
        py-10
      "
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          mb-10
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-heading
              font-medium
              text-[#14213D]
              mb-2
            "
          >
            Wanted Properties
          </h1>


          <p
            className="
              text-gray-500
              max-w-2xl
            "
          >
            Can't find what you're looking for?
            Post your requirement and let sellers
            come to you.
          </p>

        </div>


        {/* ADD WANTED BUTTON */}

        <button
          type="button"
          onClick={handleAddWanted}
          className="
            flex
            items-center
            justify-center
            gap-2
            bg-[#14213D]
            text-white
            font-semibold
            px-6
            py-3
            rounded-md
            hover:opacity-90
            transition
            whitespace-nowrap
          "
        >

          <Plus size={18} />

          Add Wanted

        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-5
            py-4
            text-center
            text-red-600
            mb-6
          "
        >
          {error}
        </div>

      )}


      {/* =================================================
          EMPTY
      ================================================= */}

      {!error &&
        requests.length === 0 && (

          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              px-6
              py-16
              text-center
            "
          >
            <h2 className="mb-2 text-xl font-semibold text-[#14213D]">
              No Wanted Properties
            </h2>
            <p className="text-gray-500">
              There are currently no wanted property requests.
            </p>
          </div>

        )}


      {/* =================================================
          WANTED REQUESTS
      ================================================= */}

      {!error &&
        requests.length > 0 && (

          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >

            {requests.map((req) => (

              <div
                key={req.id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  transition
                  hover:border-[#14213D]/20
                  hover:shadow-lg
                "
              >

                <div className="h-1 w-full bg-[#FBBF24]" />

                <div className="p-6">

                  <div className="mb-1 flex items-start justify-between gap-3">

                    <h3
                      className="
                        text-lg
                        font-heading
                        font-semibold
                        leading-snug
                        text-[#14213D]
                      "
                    >
                      {req.title}
                    </h3>

                    <span className="shrink-0 pt-1 text-xs text-gray-400">
                      {formatAge(req.postedDate || req.created_at)}
                    </span>

                  </div>

                  <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin size={14} className="text-[#FBBF24]" />
                    {req.preferred_city || 'Any location'}
                  </div>

                  {req.description && (
                    <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-gray-500">
                      {req.description}
                    </p>
                  )}

                  <div className="mb-5">
                    <p className="mb-0.5 text-xs text-gray-400">Budget up to</p>
                    <p className="text-2xl font-heading font-semibold text-[#14213D]">
                      {req.budget
                        ? `Rs. ${Number(req.budget).toLocaleString()}`
                        : 'Not specified'}
                    </p>
                  </div>

                  {req.phone_number && (
                    <a
                      href={`tel:${req.phone_number}`}
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[#14213D]
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-[#1c2d52]
                      "
                    >
                      <Phone size={15} />
                      Call {req.phone_number}
                    </a>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      {/* =====================================================
          ADD WANTED MODAL
      ===================================================== */}

      {showForm && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-[#14213D]/70
            px-4
            py-6
            backdrop-blur-sm
          "
        >

          <div
            className="
              relative
              w-full
              max-w-2xl
              max-h-[92vh]
              overflow-hidden
              rounded-3xl
              bg-white
              shadow-2xl
            "
          >

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-100
                px-6
                py-5
                sm:px-8
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#14213D]
                    text-[#FBBF24]
                  "
                >
                  <Plus size={22} />
                </div>


                <div>

                  <h3
                    className="
                      text-xl
                      sm:text-2xl
                      font-heading
                      font-semibold
                      text-[#14213D]
                    "
                  >
                    Post Wanted Property
                  </h3>


                  <p
                    className="
                      mt-0.5
                      text-sm
                      text-gray-500
                    "
                  >
                    Tell sellers what property
                    you are looking for.
                  </p>

                </div>

              </div>


              {/* CLOSE BUTTON */}

              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setShowForm(false)
                  setFormError(null)
                }}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-[#14213D]
                  disabled:cursor-not-allowed
                "
              >
                <X size={20} />
              </button>

            </div>


            {/* =================================================
                FORM CONTENT
            ================================================= */}

            <div
              className="
                max-h-[calc(92vh-90px)]
                overflow-y-auto
                px-6
                py-6
                sm:px-8
              "
            >

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* =================================================
                    TITLE
                ================================================= */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-700
                    "
                  >
                    What are you looking for?

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>


                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 3 Bedroom House in Colombo"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3
                      text-sm
                      text-gray-800
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-[#FBBF24]
                      focus:bg-white
                      focus:ring-2
                      focus:ring-[#FBBF24]/20
                    "
                  />

                </div>


                {/* =================================================
                    CITY + BUDGET
                ================================================= */}

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-5
                    sm:grid-cols-2
                  "
                >

                  {/* CITY */}

                  <div>

                    <label
                      className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                      "
                    >
                      Preferred City

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>


                    <div className="relative">

                      <MapPin
                        size={18}
                        className="
                          absolute
                          left-3.5
                          top-1/2
                          -translate-y-1/2
                          text-[#FBBF24]
                        "
                      />


                      <input
                        type="text"
                        name="preferred_city"
                        value={
                          formData.preferred_city
                        }
                        onChange={handleChange}
                        required
                        placeholder="Type city e.g. Colombo"
                        className="
                          h-12
                          w-full
                          rounded-xl
                          border
                          border-gray-200
                          bg-gray-50
                          py-3
                          pl-11
                          pr-4
                          text-sm
                          text-gray-800
                          outline-none
                          transition
                          placeholder:text-gray-400
                          focus:border-[#FBBF24]
                          focus:bg-white
                          focus:ring-2
                          focus:ring-[#FBBF24]/20
                        "
                      />

                    </div>

                  </div>


                  {/* BUDGET */}

                  <div>

                    <label
                      className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                      "
                    >
                      Maximum Budget
                    </label>


                    <div className="relative">

                      <Wallet
                        size={18}
                        className="
                          absolute
                          left-3.5
                          top-1/2
                          -translate-y-1/2
                          text-[#FBBF24]
                        "
                      />


                      <input
                        type="number"
                        name="budget"
                        min="0"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="e.g. 20000000"
                        className="
                          h-12
                          w-full
                          rounded-xl
                          border
                          border-gray-200
                          bg-gray-50
                          py-3
                          pl-11
                          pr-4
                          text-sm
                          text-gray-800
                          outline-none
                          transition
                          placeholder:text-gray-400
                          focus:border-[#FBBF24]
                          focus:bg-white
                          focus:ring-2
                          focus:ring-[#FBBF24]/20
                        "
                      />

                    </div>

                  </div>


                </div>


                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-700
                    "
                  >
                    Description
                  </label>


                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your property requirements..."
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3
                      text-sm
                      leading-relaxed
                      text-gray-800
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-[#FBBF24]
                      focus:bg-white
                      focus:ring-2
                      focus:ring-[#FBBF24]/20
                    "
                  />

                </div>


                {/* =================================================
                    PHONE
                ================================================= */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-700
                    "
                  >
                    Contact Number

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>


                  <div className="relative">

                    <Phone
                      size={18}
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-[#FBBF24]
                      "
                    />


                    <input
                      type="tel"
                      name="phone_number"
                      required
                      value={
                        formData.phone_number
                      }
                      onChange={handleChange}
                      placeholder="07X XXX XXXX"
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        text-gray-800
                        outline-none
                        transition
                        placeholder:text-gray-400
                        focus:border-[#FBBF24]
                        focus:bg-white
                        focus:ring-2
                        focus:ring-[#FBBF24]/20
                      "
                    />

                  </div>

                </div>


                {/* =================================================
                    FORM ERROR
                ================================================= */}

                {formError && (

                  <div
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-xl
                      border
                      border-red-200
                      bg-red-50
                      px-4
                      py-3
                    "
                  >

                    <div
                      className="
                        mt-0.5
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-red-500
                        text-xs
                        font-bold
                        text-white
                      "
                    >
                      !
                    </div>


                    <p className="text-sm text-red-600">
                      {formError}
                    </p>

                  </div>

                )}


                {/* =================================================
                    BUTTONS
                ================================================= */}

                <div
                  className="
                    flex
                    flex-col-reverse
                    gap-3
                    border-t
                    border-gray-100
                    pt-5
                    sm:flex-row
                    sm:justify-end
                  "
                >

                  {/* CANCEL */}

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                      setShowForm(false)
                      setFormError(null)
                    }}
                    className="
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-gray-600
                      transition
                      hover:bg-gray-50
                      hover:text-[#14213D]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>


                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#14213D]
                      px-7
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      shadow-sm
                      transition
                      hover:bg-[#1c2d52]
                      hover:shadow-md
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >

                    {submitting ? (

                      <>
                        <span
                          className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-white/30
                            border-t-white
                          "
                        />

                        Submitting...
                      </>

                    ) : (

                      <>
                        <Plus size={17} />

                        Add Wanted
                      </>

                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>

  )

}


export default Wanted