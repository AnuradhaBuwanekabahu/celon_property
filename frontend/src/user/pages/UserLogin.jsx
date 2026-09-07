import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Mail,
  Lock,
  ArrowLeft,
  UserPlus,
  ShieldCheck,
  LogIn,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function UserLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const redirectPath = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)

  // =====================================================
  // SAVE USER
  // =====================================================

  const saveUser = (data) => {
    localStorage.setItem('userToken', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  // =====================================================
  // LOGIN SUCCESS
  // =====================================================

  const handleSignInSuccess = (data) => {
    saveUser(data)
    navigate(redirectPath)
  }

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleCredentialResponse = useCallback(
    async (response) => {
      if (!response?.credential) {
        setError('Google login failed. Please try again.')
        return
      }

      setError(null)
      setLoading(true)

      try {
        const res = await fetch(`${API_URL}/api/users/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_token: response.credential,
          }),
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Google login failed')
        }

        handleSignInSuccess(data)
      } catch (err) {
        setError(err.message || 'Google login failed')
      } finally {
        setLoading(false)
      }
    },
    [navigate],
  )

  // =====================================================
  // GOOGLE INITIALIZATION
  // =====================================================

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    const initializeGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
        })

        const googleButton = document.getElementById(
          'google-signin-button',
        )

        if (googleButton) {
          googleButton.innerHTML = ''

          window.google.accounts.id.renderButton(
            googleButton,
            {
              theme: 'outline',
              size: 'large',
              width: '100%',
            },
          )
        }

        setGoogleReady(true)
      }
    }

    initializeGoogle()

    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        initializeGoogle()
        clearInterval(interval)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [handleGoogleCredentialResponse])

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || googleReady === false) return
    if (localStorage.getItem('userToken')) return

    const autoPromptShown = sessionStorage.getItem('googleAutoPromptShown') === 'true'
    if (autoPromptShown) return

    const timer = setTimeout(() => {
      if (!window.google?.accounts?.id) return

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          sessionStorage.setItem('googleAutoPromptShown', 'true')
        }
      })
    }, 800)

    return () => clearTimeout(timer)
  }, [googleReady])

  // =====================================================
  // EMAIL LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError(null)
    setShowSignupPrompt(false)

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Email login failed')
      }

      handleSignInSuccess(data)
    } catch (err) {
      setError(err.message || 'Email login failed')
      setShowSignupPrompt(true)
      setLoading(false)
    }
  }

  // =====================================================
  // GOOGLE BUTTON
  // =====================================================

  const handleGoogleLogin = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt()
      return
    }

    setError(
      'Google sign-in is not available right now. Please refresh the page.',
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-10">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div
          className="
            absolute
            -top-32
            -right-32
            w-96
            h-96
            rounded-full
            bg-[#FBBF24]/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -left-40
            w-[500px]
            h-[500px]
            rounded-full
            bg-[#14213D]/5
            blur-3xl
          "
        />

      </div>


      {/* =====================================================
          LOGIN CARD
      ===================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          bg-white
          rounded-3xl
          border
          border-gray-200
          shadow-[0_20px_60px_-15px_rgba(20,33,61,0.15)]
          overflow-hidden
        "
      >

        {/* =====================================================
            TOP HEADER
        ===================================================== */}

        <div className="bg-[#14213D] px-8 pt-7 pb-8">

          {/* Back */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              text-white/70
              hover:text-white
              transition
              mb-7
            "
          >
            <ArrowLeft size={16} />
            Back
          </button>


          {/* Logo / Icon */}

          <div className="flex items-center gap-4">

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-[#FBBF24]
                flex
                items-center
                justify-center
                shadow-lg
              "
            >
              <LogIn
                size={24}
                className="text-[#14213D]"
              />
            </div>

            <div>

              <p className="text-[#FBBF24] text-xs font-semibold uppercase tracking-wider">
                Ceylon Properties
              </p>

              <h1 className="text-2xl font-semibold text-white mt-1">
                Welcome back
              </h1>

            </div>

          </div>

          <p className="text-white/65 text-sm mt-5 leading-relaxed">
            Sign in to access your account and continue
            your property journey.
          </p>

        </div>


        {/* =====================================================
            FORM CONTENT
        ===================================================== */}

        <div className="px-8 py-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =================================================
                EMAIL
            ================================================= */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <div
                className="
                  relative
                  flex
                  items-center
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  transition
                  focus-within:border-[#14213D]
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-[#14213D]/5
                "
              >

                <Mail
                  size={18}
                  className="
                    absolute
                    left-4
                    text-gray-400
                    pointer-events-none
                  "
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full
                    bg-transparent
                    border-0
                    pl-11
                    pr-4
                    py-3.5
                    text-sm
                    text-gray-900
                    outline-none
                    rounded-xl
                  "
                  placeholder="you@example.com"
                  required
                />

              </div>

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div>

              <div className="flex items-center justify-between mb-2">

                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>

              </div>

              <div
                className="
                  relative
                  flex
                  items-center
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  transition
                  focus-within:border-[#14213D]
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-[#14213D]/5
                "
              >

                <Lock
                  size={18}
                  className="
                    absolute
                    left-4
                    text-gray-400
                    pointer-events-none
                  "
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full
                    bg-transparent
                    border-0
                    pl-11
                    pr-4
                    py-3.5
                    text-sm
                    text-gray-900
                    outline-none
                    rounded-xl
                  "
                  placeholder="Enter your password"
                  required
                />

              </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

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
                    w-2
                    h-2
                    rounded-full
                    bg-red-500
                    mt-1.5
                    shrink-0
                  "
                />

                <p className="text-sm text-red-600 leading-relaxed">
                  {error}
                </p>

              </div>

            )}


            {/* =================================================
                SIGN IN BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#14213D]
                px-5
                py-3.5
                text-white
                text-sm
                font-semibold
                shadow-md
                hover:bg-[#0f172a]
                hover:shadow-lg
                transition-all
                duration-200
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >

              <LogIn size={18} />

              {loading
                ? 'Signing in...'
                : 'Sign in with Email'}

            </button>

          </form>


          {/* =====================================================
              DIVIDER
          ===================================================== */}

          <div className="flex items-center gap-4 my-7">

            <div className="flex-1 h-px bg-gray-200" />

            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              or continue with
            </span>

            <div className="flex-1 h-px bg-gray-200" />

          </div>


          {/* =====================================================
              GOOGLE LOGIN
          ===================================================== */}

          <div className="relative">

            <div
              id="google-signin-button"
              className="
                w-full
                min-h-[44px]
                flex
                justify-center
              "
            />

            {!googleReady && GOOGLE_CLIENT_ID && (

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="
                  absolute
                  inset-0
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-gray-700
                  text-sm
                  font-semibold
                  hover:bg-gray-50
                  transition
                "
              >
                Continue with Google
              </button>

            )}

          </div>


          {/* =====================================================
              SIGNUP PROMPT
          ===================================================== */}

          {showSignupPrompt ? (

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-[#FBBF24]/30
                bg-[#FBBF24]/10
                p-5
              "
            >

              <div className="flex items-start gap-3">

                <div
                  className="
                    w-9
                    h-9
                    rounded-xl
                    bg-[#FBBF24]
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <UserPlus
                    size={18}
                    className="text-[#14213D]"
                  />
                </div>

                <div>

                  <h3 className="text-sm font-semibold text-[#14213D] mb-1">
                    Don't have an account?
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Create an account to save properties,
                    contact sellers, and manage your
                    property activities.
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={() => navigate('/user-signup')}
                className="
                  w-full
                  mt-4
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#14213D]
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-[#0f172a]
                  transition
                "
              >
                <UserPlus size={17} />
                Create Account
              </button>

            </div>

          ) : (

            <div className="mt-7 text-center">

              <p className="text-sm text-gray-500">

                Don't have an account?{' '}

                <button
                  type="button"
                  onClick={() => navigate('/user-signup')}
                  className="
                    font-semibold
                    text-[#14213D]
                    hover:text-[#F59E0B]
                    transition
                  "
                >
                  Sign up
                </button>

              </p>

            </div>

          )}


          {/* =====================================================
              SECURITY NOTE
          ===================================================== */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              mt-7
              text-xs
              text-gray-400
            "
          >

            <ShieldCheck size={14} />

            <span>
              Your information is securely protected
            </span>

          </div>

        </div>

      </div>

    </div>
  )
}

export default UserLogin