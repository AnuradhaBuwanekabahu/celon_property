import { useState, useEffect } from 'react'

import { useParams, useNavigate, Link } from 'react-router-dom'

import {
  ChevronLeft,
  MapPin,
  ArrowRight,
  Play,
  Ruler,
  Clock,
  CheckCircle,
  Mail,
  Phone,
  Send,
  MessageCircle,
} from 'lucide-react'

import {
  getHotSales,
  getStayToRent,
  getStayToBuy,
  getLands,
  getHotSaleById,
  getLandById,
  getStayToRentById,
  getStayToBuyById,
  getClientById,
  sendPropertyInquiry
} from '../Routers'

import {
  getOverviewIcon,
  getOverviewData,
  getOverviewValue,
  getOverviewTitle
} from '../utils/overviewIcons'

import PropertyCard from '../components/property/PropertyCard'
import Loader from '../components/property/Loader.jsx'


function PropertyDetails() {
  const { type, id } = useParams()
  const navigate = useNavigate()

  const [property, setProperty] = useState(null)
  const [client, setClient] = useState(null)

  const [loading, setLoading] = useState(true)
  const [clientLoading, setClientLoading] = useState(false)

  const [error, setError] = useState(null)

  const [showGallery, setShowGallery] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    message: ''
  })

  const [sending, setSending] = useState(false)

  const [similarProperties, setSimilarProperties] = useState([])
  const [similarLoading, setSimilarLoading] = useState(false)


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
  // FETCH PROPERTY
  // =====================================================

  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true)
        setError(null)
        setClient(null)

        let result

        switch (type) {

          case 'hotsale':
            result = await getHotSaleById(id)
            break

          case 'land':
            result = await getLandById(id)
            break

          case 'staytorent':
            result = await getStayToRentById(id)
            break

          case 'staytobuy':
            result = await getStayToBuyById(id)
            break

          default:
            throw new Error('Invalid property type')
        }

        if (!result || !result.id) {
          throw new Error('Property not found')
        }

        // Store property
        setProperty(result)


        // =================================================
        // GET CLIENT DETAILS
        // =================================================

        if (result.clientId) {

          try {
            setClientLoading(true)

            const clientData = await getClientById(result.clientId)

            setClient(clientData)

          } catch (clientError) {

            console.error(
              'Failed to fetch client:',
              clientError
            )

            setClient(null)

          } finally {

            setClientLoading(false)

          }

        } else {

          setClient(null)

        }

      } catch (err) {

        console.error(err)

        setError('Property not found.')

      } finally {

        setLoading(false)

      }
    }

    fetchProperty()

  }, [id, type])


  // =====================================================
  // FETCH SIMILAR PROPERTIES
  // =====================================================

  useEffect(() => {

    async function fetchSimilarProperties() {

      if (!property || !type) return

      try {

        setSimilarLoading(true)

        let allProperties = []


        // ================================================
        // GET PROPERTIES ACCORDING TO CURRENT TYPE
        // ================================================

        switch (type) {

          case 'hotsale':
            allProperties = await getHotSales()
            break

          case 'staytorent':
            allProperties = await getStayToRent()
            break

          case 'staytobuy':
            allProperties = await getStayToBuy()
            break

          case 'land':
            allProperties = await getLands()
            break

          default:
            allProperties = []

        }


        // ================================================
        // CURRENT PROPERTY INFORMATION
        // ================================================

        const currentId = Number(property.id)

        const currentType = String(
          property.propertyType ||
          property.property_type ||
          property.tag ||
          ''
        )
          .trim()
          .toLowerCase()

        const currentCity = String(
          property.city ||
          property.location ||
          ''
        )
          .trim()
          .toLowerCase()

        const currentPrice = Number(
          property.priceRs ||
          property.price ||
          0
        )


        // ================================================
        // FILTER + SCORE
        // ================================================

        const scoredProperties = allProperties

          // Remove current property
          .filter(
            (item) =>
              Number(item.id) !== currentId
          )

          .map((item) => {

            const itemType = String(
              item.propertyType ||
              item.property_type ||
              item.tag ||
              ''
            )
              .trim()
              .toLowerCase()

            const itemCity = String(
              item.city ||
              item.location ||
              ''
            )
              .trim()
              .toLowerCase()

            const itemPrice = Number(
              item.priceRs ||
              item.price ||
              0
            )

            let score = 0


            // ==========================================
            // 1. SAME PROPERTY TYPE
            // ==========================================

            if (
              currentType &&
              itemType &&
              itemType === currentType
            ) {
              score += 3
            }


            // ==========================================
            // 2. SAME CITY
            // ==========================================

            if (
              currentCity &&
              itemCity &&
              (
                itemCity.includes(currentCity) ||
                currentCity.includes(itemCity)
              )
            ) {
              score += 3
            }


            // ==========================================
            // 3. PRICE SIMILARITY
            // ==========================================

            if (
              currentPrice > 0 &&
              itemPrice > 0
            ) {

              const difference = Math.abs(
                itemPrice - currentPrice
              )

              const percentageDifference =
                difference / currentPrice


              // Same / very close price
              if (percentageDifference <= 0.10) {

                score += 3

              }

              // Within 20%
              else if (percentageDifference <= 0.20) {

                score += 2

              }

              // Within 30%
              else if (percentageDifference <= 0.30) {

                score += 1

              }

            }


            return {
              ...item,
              similarityScore: score
            }

          })

          // ==========================================
          // ONLY REASONABLY SIMILAR PROPERTIES
          // ==========================================

          .filter(
            (item) =>
              item.similarityScore > 0
          )

          // Highest score first
          .sort(
            (a, b) =>
              b.similarityScore -
              a.similarityScore
          )

          // Only show 4
          .slice(0, 4)


        setSimilarProperties(
          scoredProperties
        )

      } catch (error) {

        console.error(
          'Failed to fetch similar properties:',
          error
        )

        setSimilarProperties([])

      } finally {

        setSimilarLoading(false)

      }

    }

    fetchSimilarProperties()

  }, [property, type])


  // =====================================================
  // CHECK LOGIN
  // =====================================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem('user')

    if (!storedUser) {

      setIsLoggedIn(false)

      return

    }

    try {

      const userData =
        JSON.parse(storedUser)

      setIsLoggedIn(true)

      setFormData(prev => ({
        ...prev,
        email: userData.email || '',
      }))

    } catch (error) {

      console.error(
        'Failed to read user information:',
        error
      )

      setIsLoggedIn(false)

    }

  }, [])


  // =====================================================
  // WHATSAPP NUMBER
  // =====================================================

  const getWhatsAppNumber = (number) => {

    if (!number) return ''

    const cleaned =
      String(number).replace(/\D/g, '')

    if (cleaned.startsWith('0')) {

      return '94' + cleaned.slice(1)

    }

    return cleaned

  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return <Loader />
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error || !property) {

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">

        <p className="text-gray-600 text-lg mb-4">
          {error || 'Property not found.'}
        </p>

        <button
          onClick={() => navigate(-1)}
          className="bg-[#14213D] text-white px-5 py-2.5 rounded-lg"
        >
          Go Back
        </button>

      </div>
    )

  }


  // =====================================================
  // CONTACT SUBMIT
  // =====================================================

  const handleContactSubmit = async (e) => {

    e.preventDefault()

    const storedUser =
      localStorage.getItem('user')

    if (!storedUser) {

      alert(
        'Please login to send an inquiry.'
      )

      navigate('/user-login')

      return
    }


    if (
      !formData.email ||
      !formData.message
    ) {

      alert(
        'Please fill all fields.'
      )

      return

    }


    if (!client?.email) {

      alert(
        'Property owner email is not available.'
      )

      return

    }


    try {

      setSending(true)

      await sendPropertyInquiry({

        clientEmail: client.email,

        propertyTitle:
          property.title,

        userEmail:
          formData.email,

        message:
          formData.message

      })


      alert(
        'Your message has been sent to the property client successfully.'
      )


      setFormData(prev => ({
        ...prev,
        message: ''
      }))

    } catch (error) {

      console.error(
        'Inquiry error:',
        error
      )

      alert(
        error.message ||
        'Failed to send message.'
      )

    } finally {

      setSending(false)

    }

  }


  // =====================================================
  // GALLERY
  // =====================================================

  const gallery =
    (property.gallery || [])
      .filter(Boolean)

  const images =
    gallery.length > 0
      ? gallery
      : property.image
        ? [property.image]
        : []

  const mainImage = images[0]


  // =====================================================
  // MAIN RETURN
  // =====================================================

  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 hover:text-black mb-6 transition"
      >

        <ChevronLeft size={20} />

        <span className="font-medium">
          Back
        </span>

      </button>


      {/* =====================================================
          PROPERTY GALLERY
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3 mb-10">

        {/* Main Image */}

        <div className="relative h-[280px] md:h-[450px] rounded-2xl overflow-hidden bg-gray-200">

          {mainImage ? (

            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display =
                  'none'
              }}
            />

          ) : (

            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>

          )}


          {/* Property Type */}

          <span className="absolute top-4 left-4 bg-white/95 text-[#14213D] text-sm font-semibold px-4 py-2 rounded-full shadow">

            {property.propertyType ||
              property.tag ||
              'Property'}

          </span>

        </div>


        {/* Small Images */}

        <div className="grid grid-cols-2 gap-3">

          {[1, 2, 3, 4].map((index) => {

            const image = images[index]

            return (

              <div
                key={index}
                className="relative h-[135px] md:h-[219px] rounded-xl overflow-hidden bg-gray-200"
              >

                {image ? (

                  <img
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>

                )}


                {/* See More */}

                {index === 3 &&
                  images.length > 5 && (

                    <button
                      onClick={() =>
                        setShowGallery(true)
                      }
                      className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 text-white font-medium hover:bg-black/60 transition"
                    >

                      <span>
                        See More
                      </span>

                      <ArrowRight size={18} />

                    </button>

                  )}

              </div>

            )

          })}

        </div>

      </div>


      {/* =====================================================
          MAIN INFORMATION + CONTACT
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10">


        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div>


          {/* Title */}

          <h1 className="text-3xl md:text-4xl font-semibold text-[#14213D] mb-3">
            {property.title}
          </h1>


          {/* Location */}

          <p className="flex items-start gap-2 text-gray-600 mb-6">

            <MapPin
              size={19}
              className="text-[#FBBF24] shrink-0 mt-0.5"
            />

            <span>
              {property.location ||
                property.city ||
                'Location not available'}
            </span>

          </p>


          {/* =================================================
              PRICE
          ================================================= */}

          <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">

            <p className="text-sm text-gray-500 mb-1">
              Price
            </p>

            <div className="flex flex-wrap items-baseline gap-2">

              <span className="text-2xl md:text-3xl font-bold text-[#14213D]">

                LKR{' '}

                {Number(
                  property.priceRs ||
                  property.price ||
                  0
                ).toLocaleString()}

              </span>


              {Number(
                property.priceRs ??
                property.price ??
                0
              ) >= 1000000 && (

                <span className="text-sm font-semibold text-gray-400">

                  (
                  {(
                    Number(
                      property.priceRs ??
                      property.price ??
                      0
                    ) / 1000000
                  ).toLocaleString(
                    'en-US',
                    {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }
                  )}{' '}
                  Million)

                </span>

              )}


              {/* Stay To Rent Price Period */}

              {property.pricePeriod && (

                <span className="text-gray-500 text-base">
                  / {property.pricePeriod}
                </span>

              )}

            </div>

          </div>


          {/* =================================================
              PROPERTY INFORMATION
          ================================================= */}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">


            {/* Area */}

            <div className="border border-gray-200 rounded-xl p-4">

              <Ruler
                size={20}
                className="text-[#FBBF24] mb-2"
              />

              <p className="text-xs text-gray-500">
                Area
              </p>

              <p className="font-semibold text-gray-900 mt-1">
                {property.landArea || 'N/A'}
              </p>

            </div>


            {/* Duration */}

            <div className="border border-gray-200 rounded-xl p-4">

              <Clock
                size={20}
                className="text-[#FBBF24] mb-2"
              />

              <p className="text-xs text-gray-500">
                Duration
              </p>

              <p className="font-semibold text-gray-900 mt-1 capitalize">
                {property.duration ||
                  'Permanent'}
              </p>

            </div>


            {/* City */}

            <div className="border border-gray-200 rounded-xl p-4">

              <MapPin
                size={20}
                className="text-[#FBBF24] mb-2"
              />

              <p className="text-xs text-gray-500">
                City
              </p>

              <p className="font-semibold text-gray-900 mt-1">
                {property.city || 'N/A'}
              </p>

            </div>

          </div>


          {/* =================================================
              OVERVIEW
          ================================================= */}

          {(() => {

            const overviewData =
              getOverviewData(
                property.overview
              )

            const overviewItems =
              overviewData.filter((item) => {

                const value =
                  getOverviewValue(item)

                return (
                  String(value).trim() !== ''
                )

              })


            if (
              overviewItems.length === 0
            ) {
              return null
            }


            return (

              <div className="mb-8">

                <div className="flex items-center justify-between mb-4">

                  <h2 className="text-2xl font-semibold text-[#14213D]">
                    Overview
                  </h2>

                  <span className="text-sm text-gray-400">

                    {overviewItems.length}{' '}

                    {overviewItems.length === 1
                      ? 'detail'
                      : 'details'}

                  </span>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {overviewItems.map(
                    (item, index) => {

                      const title =
                        getOverviewTitle(item)

                      const value =
                        getOverviewValue(item)

                      const Icon =
                        getOverviewIcon(title)


                      return (

                        <div
                          key={`${title}-${index}`}
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-[#E5E5E5]
                            bg-gray-50
                            p-4
                            transition
                            hover:border-[#FBBF24]
                            hover:bg-[#FFFBEB]
                          "
                        >

                          <div
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-[#14213D]
                            "
                          >

                            <Icon
                              size={20}
                              strokeWidth={2}
                              className="text-[#FBBF24]"
                            />

                          </div>


                          <div className="min-w-0">

                            <p
                              className="
                                text-sm
                                font-semibold
                                text-[#14213D]
                              "
                            >
                              {value}
                            </p>

                            <p
                              className="
                                text-xs
                                text-gray-500
                                mt-0.5
                              "
                            >
                              {title}
                            </p>

                          </div>

                        </div>

                      )

                    }
                  )}

                </div>

              </div>

            )

          })()}


          {/* =================================================
              HIGHLIGHTS
          ================================================= */}

          {property.highlights?.length > 0 && (

            <div className="mb-8">

              <h2 className="text-2xl font-semibold text-[#14213D] mb-4">
                Highlights
              </h2>

              <div className="flex flex-wrap gap-3">

                {property.highlights.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2"
                    >

                      <CheckCircle
                        size={16}
                        className="text-green-500"
                      />

                      <span className="text-sm text-gray-700">

                        {typeof item === 'object'
                          ? item.title ||
                            item.label ||
                            item.value
                          : item}

                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div>

            <h2 className="text-2xl font-semibold text-[#14213D] mb-3">
              Description
            </h2>

            <p className="text-gray-600 leading-7 whitespace-pre-line">
              {property.description ||
                'No description available.'}
            </p>

          </div>


          {/* =================================================
              PROPERTY VIDEO
          ================================================= */}

          {property.video && (

            <div className="mt-10">

              <div className="flex items-center gap-3 mb-4">

                <div className="w-10 h-10 rounded-xl bg-[#14213D] flex items-center justify-center">

                  <Play
                    size={20}
                    className="text-[#FBBF24]"
                  />

                </div>

                <div>

                  <h2 className="text-2xl font-semibold text-[#14213D]">
                    Property Video
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Watch the property video
                  </p>

                </div>

              </div>


              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-black">

                <video
                  controls
                  className="w-full h-[400px] object-cover"
                  poster={property.image}
                >

                  <source
                    src={property.video}
                    type="video/mp4"
                  />

                  Your browser does not support the video tag.

                </video>

              </div>

            </div>

          )}


          {/* =================================================
              PROPERTY LOCATION MAP
          ================================================= */}

          {(property.mapAddress ||
            property.map_address ||
            property.location ||
            property.city) && (

            <div className="mt-10">

              <div className="flex items-center gap-3 mb-4">

                <div className="w-10 h-10 rounded-xl bg-[#14213D] flex items-center justify-center">

                  <MapPin
                    size={20}
                    className="text-[#FBBF24]"
                  />

                </div>

                <div>

                  <h2 className="text-2xl font-semibold text-[#14213D]">
                    Property Location
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">

                    {property.mapAddress ||
                      property.map_address ||
                      property.location ||
                      property.city}

                  </p>

                </div>

              </div>


              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

                <iframe
                  title="Property Location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    property.mapAddress ||
                    property.map_address ||
                    property.location ||
                    property.city
                  )}&output=embed`}
                  width="100%"
                  height="400"
                  style={{
                    border: 0
                  }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />

              </div>

            </div>

          )}

        </div>


        {/* =================================================
            RIGHT SIDE - CONTACT
        ================================================= */}

        <div className="bg-[#14213D] rounded-2xl p-6 md:p-8 text-white h-fit lg:sticky lg:top-6">

          <div className="mb-6">

            <div className="flex items-center gap-3 mb-2">

              <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 flex items-center justify-center">

                <Mail
                  size={20}
                  className="text-[#FBBF24]"
                />

              </div>

              <div>

                <h2 className="text-xl font-semibold text-white">
                  Interested in this property?
                </h2>

              </div>

            </div>

            <p className="text-sm text-gray-400 leading-6 mt-4">
              Have questions about this property?
              Send an inquiry and the owner can
              contact you directly.
            </p>

          </div>


          {/* =================================================
              CLIENT / PROPERTY OWNER CONTACT
          ================================================= */}

          <div className="mb-7">

            {clientLoading ? (

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">

                <div className="flex items-center gap-3">

                  <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />

                  <div className="space-y-2">

                    <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />

                    <div className="h-4 w-36 rounded bg-white/10 animate-pulse" />

                  </div>

                </div>

              </div>

            ) : client ? (

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] overflow-hidden">

                {/* HEADER */}

                <div className="flex items-center gap-4 p-5">

                  <div className="relative shrink-0">

                    <div className="w-14 h-14 rounded-full bg-[#FBBF24] flex items-center justify-center">

                      <span className="text-xl font-bold text-[#14213D]">

                        {(client.full_name ||
                          'P')
                          .charAt(0)
                          .toUpperCase()}

                      </span>

                    </div>

                  </div>


                  <div className="min-w-0">

                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Property Owner
                    </p>

                    <h3 className="text-lg font-semibold text-white mt-1 truncate">
                      {client.full_name ||
                        'Property Owner'}
                    </h3>

                  </div>

                </div>


                {/* CONTACT OPTIONS */}

                <div className="border-t border-white/10 p-3">

                  {/* Phone */}

                  {client.phone_number && (

                    <a
                      href={`tel:${client.phone_number}`}
                      className="group flex items-center gap-4 rounded-xl px-3 py-3.5 hover:bg-white/[0.07] transition"
                    >

                      <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-500/15 flex items-center justify-center">

                        <Phone
                          size={18}
                          className="text-blue-400"
                        />

                      </div>

                      <div className="flex-1 min-w-0">

                        <p className="text-xs text-gray-400">
                          Phone
                        </p>

                        <p className="text-sm font-medium text-white mt-0.5">
                          {client.phone_number}
                        </p>

                      </div>

                      <ArrowRight
                        size={17}
                        className="text-gray-500 group-hover:text-[#FBBF24] group-hover:translate-x-1 transition"
                      />

                    </a>

                  )}


                  {/* WhatsApp */}

                  {client.whatsapp_number && (

                    <a
                      href={`https://wa.me/${getWhatsAppNumber(
                        client.whatsapp_number
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-xl px-3 py-3.5 hover:bg-white/[0.07] transition"
                    >

                      <div className="w-10 h-10 shrink-0 rounded-xl bg-[#25D366]/15 flex items-center justify-center">

                        <MessageCircle
                          size={18}
                          className="text-[#25D366]"
                        />

                      </div>

                      <div className="flex-1 min-w-0">

                        <p className="text-xs text-gray-400">
                          WhatsApp
                        </p>

                        <p className="text-sm font-medium text-white mt-0.5">
                          {client.whatsapp_number}
                        </p>

                      </div>

                      <ArrowRight
                        size={17}
                        className="text-gray-500 group-hover:text-[#25D366] group-hover:translate-x-1 transition"
                      />

                    </a>

                  )}


                  {/* Email */}

                  {client.email && (

                    <a
                      href={`mailto:${client.email}`}
                      className="group flex items-center gap-4 rounded-xl px-3 py-3.5 hover:bg-white/[0.07] transition"
                    >

                      <div className="w-10 h-10 shrink-0 rounded-xl bg-[#FBBF24]/15 flex items-center justify-center">

                        <Mail
                          size={18}
                          className="text-[#FBBF24]"
                        />

                      </div>

                      <div className="flex-1 min-w-0">

                        <p className="text-xs text-gray-400">
                          Email
                        </p>

                        <p className="text-sm font-medium text-white mt-0.5 truncate">
                          {client.email}
                        </p>

                      </div>

                      <ArrowRight
                        size={17}
                        className="text-gray-500 group-hover:text-[#FBBF24] group-hover:translate-x-1 transition"
                      />

                    </a>

                  )}

                </div>

              </div>

            ) : (

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">

                    <Phone
                      size={17}
                      className="text-gray-400"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-medium text-white">
                      Property Owner
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Seller information is not available.
                    </p>

                  </div>

                </div>

              </div>

            )}

          </div>


          {/* =================================================
              CONTACT FORM
          ================================================= */}

          {isLoggedIn ? (

            <form
              onSubmit={handleContactSubmit}
              className="space-y-5"
            >

              <div className="mb-2">

                <h3 className="text-lg font-semibold text-white">
                  Send an Inquiry
                </h3>

              </div>


              {/* Email */}

              <div>

                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Your Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        email:
                          e.target.value
                      }))
                    }
                    placeholder="your@email.com"
                    required
                    className="
                      w-full
                      bg-white
                      text-gray-900
                      placeholder:text-gray-400
                      rounded-xl
                      pl-10
                      pr-4
                      py-3
                      text-sm
                      outline-none
                      border border-transparent
                      focus:border-[#FBBF24]
                      focus:ring-2
                      focus:ring-[#FBBF24]/20
                    "
                  />

                </div>

              </div>


              {/* Message */}

              <div>

                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Your Message
                </label>

                <div className="relative">

                  <Send
                    size={18}
                    className="absolute left-3 top-4 text-gray-400"
                  />

                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        message:
                          e.target.value
                      }))
                    }
                    placeholder={`I'm interested in ${property.title}...`}
                    required
                    className="
                      w-full
                      bg-white
                      text-gray-900
                      placeholder:text-gray-400
                      rounded-xl
                      pl-10
                      pr-4
                      py-3
                      text-sm
                      outline-none
                      border border-transparent
                      resize-none
                      focus:border-[#FBBF24]
                      focus:ring-2
                      focus:ring-[#FBBF24]/20
                    "
                  />

                </div>

              </div>


              {/* Send */}

              <button
                type="submit"
                disabled={sending}
                className="
                  w-full
                  bg-[#FBBF24]
                  text-[#14213D]
                  font-semibold
                  py-3.5
                  px-6
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-all
                  hover:bg-yellow-400
                  active:scale-[0.98]
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >

                <Send size={18} />

                {sending
                  ? 'Sending Message...'
                  : 'Send Message'}

              </button>


              <div className="flex items-center justify-center gap-2 pt-1">

                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />

                <p className="text-xs text-gray-400">
                  Your information is kept private and secure.
                </p>

              </div>

            </form>

          ) : (

            /* NOT LOGGED IN */

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-center">

              <div className="w-12 h-12 mx-auto rounded-full bg-[#FBBF24]/10 flex items-center justify-center mb-4">

                <Mail
                  size={22}
                  className="text-[#FBBF24]"
                />

              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                Login to Contact the Owner
              </h3>

              <p className="text-sm text-gray-400 leading-6 mb-5">
                Please login to your account before sending an inquiry about this property.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate('/user-login')
                }
                className="
                  w-full
                  bg-[#FBBF24]
                  text-[#14213D]
                  font-semibold
                  py-3
                  rounded-xl
                  hover:bg-yellow-400
                  transition
                "
              >
                Login to Continue
              </button>

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          SIMILAR PROPERTIES
      ===================================================== */}

      {similarProperties.length > 0 && (

        <section className="mt-16">

          {/* Header */}

          <div className="flex items-end justify-between mb-6">

            <div>

              <p className="text-sm font-semibold text-[#FBBF24] uppercase tracking-wide mb-1">
                You may also like
              </p>

              <h2 className="text-2xl md:text-3xl font-semibold text-[#14213D]">
                Similar Properties
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Explore properties similar to this one.
              </p>

            </div>

          </div>


          {/* Properties */}

          {similarLoading ? (

            <div className="py-10 text-center text-gray-500">
              Loading similar properties...
            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {similarProperties.map(
                (similarProperty) => (

                  <div
                    key={similarProperty.id}
                    className="group"
                  >

                    <Link
                      to={`/property/${type}/${similarProperty.id}`}
                      className="block"
                    >

                      <PropertyCard
                        property={similarProperty}
                      />

                    </Link>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      )}


      {/* =====================================================
          FULL GALLERY
      ===================================================== */}

      {showGallery && (

        <div className="fixed inset-0 z-50 bg-black/80 p-4 overflow-y-auto">

          <div className="max-w-6xl mx-auto pt-10">

            <button
              onClick={() =>
                setShowGallery(false)
              }
              className="fixed top-5 right-5 bg-white text-black rounded-full px-4 py-2 font-semibold"
            >
              Close
            </button>

            <h2 className="text-white text-2xl font-semibold mb-6">
              {property.title} - Gallery
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {images.map(
                (image, index) => (

                  <img
                    key={index}
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    className="w-full h-64 object-cover rounded-xl"
                  />

                )
              )}

            </div>

          </div>

        </div>

      )}

    </div>

  )
}


export default PropertyDetails