
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  ArrowLeft,
  User,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function UserSignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('form')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)

  const saveUser = (data) => {
    localStorage.setItem('userToken', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const handleSignUpSuccess = (data) => {
    saveUser(data)
    navigate('/')
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    setError(null)

    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit verification code.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Verification failed')
      }

      handleSignUpSuccess(data)
    } catch (err) {
      setError(err.message || 'Verification failed')
      setLoading(false)
    }
  }

  const resendOtp = async () => {
    setError(null)
    setResendLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/users/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not resend OTP')
      }
    } catch (err) {
      setError(err.message || 'Could not resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  const handleGoogleCredentialResponse = useCallback(
    async (response) => {
      if (!response?.credential) {
        setError('Google signup failed. Please try again.')
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
          throw new Error(data.message || 'Google signup failed')
        }

        handleSignUpSuccess(data)
      } catch (err) {
        setError(err.message || 'Google signup failed')
      } finally {
        setLoading(false)
      }
    },
    [navigate],
  )

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    const initializeGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
        })

        window.google.accounts.id.renderButton(
          document.getElementById('google-signup-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
          },
        )

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!fullName || !email || !password) {
      setError('Full name, email, and password are required.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Signup failed')
      }

      setStep('otp')
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Signup failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-10">

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[450px] h-[450px] rounded-full bg-[#FBBF24]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] rounded-full bg-[#14213D]/10 blur-3xl" />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">

        <div className="bg-white rounded-[28px] border border-gray-200 shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-[#14213D] px-8 pt-8 pb-10 relative overflow-hidden">

            {/* Decorative circles */}
            <div className="absolute -right-12 -top-16 w-40 h-40 rounded-full border border-white/10" />
            <div className="absolute right-10 bottom-[-50px] w-32 h-32 rounded-full bg-[#FBBF24]/10" />

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="relative z-10 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition mb-7"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <div className="relative z-10 flex items-center gap-3 mb-4">

              <div className="w-12 h-12 rounded-2xl bg-[#FBBF24] flex items-center justify-center">
                {step === 'form' ? (
                  <User size={23} className="text-[#14213D]" />
                ) : (
                  <ShieldCheck size={23} className="text-[#14213D]" />
                )}
              </div>

              <div>
                <p className="text-[#FBBF24] text-xs font-semibold uppercase tracking-wider">
                  Ceylon Properties
                </p>

                <p className="text-white/60 text-xs mt-0.5">
                  {step === 'form'
                    ? 'Create your account'
                    : 'Email verification'}
                </p>
              </div>

            </div>

            <h1
              className="relative z-10 text-white text-3xl md:text-4xl leading-tight"
              style={{
                fontFamily: 'var(--font-hero)',
              }}
            >
              {step === 'form'
                ? 'Create your account'
                : 'Verify your email'}
            </h1>

            <p className="relative z-10 text-white/70 text-sm mt-3 max-w-sm">
              {step === 'form'
                ? 'Join Ceylon Properties and discover a better way to find your perfect property.'
                : `Enter the verification code sent to ${email}.`}
            </p>

          </div>


          {/* Form Area */}
          <div className="p-7 md:p-8">

            {/* Progress */}
            <div className="flex items-center gap-3 mb-7">

              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                  step === 'form'
                    ? 'bg-[#14213D] text-white'
                    : 'bg-[#FBBF24] text-[#14213D]'
                }`}
              >
                {step === 'form' ? '1' : <CheckCircle2 size={16} />}
              </div>

              <div
                className={`h-0.5 flex-1 ${
                  step === 'otp'
                    ? 'bg-[#FBBF24]'
                    : 'bg-gray-200'
                }`}
              />

              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                  step === 'otp'
                    ? 'bg-[#14213D] text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                2
              </div>

            </div>


            {/* =================================================
                SIGNUP FORM
            ================================================= */}

            {step === 'form' ? (

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Full Name */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:bg-white focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D]/10"
                    />

                  </div>

                </div>


                {/* Email */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:bg-white focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D]/10"
                    />

                  </div>

                </div>


                {/* Password */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                      className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:bg-white focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D]/10"
                    />

                  </div>

                </div>


                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}


                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#14213D] text-white text-sm font-semibold hover:bg-[#0f172a] transition shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

              </form>

            ) : (

              /* =================================================
                  OTP FORM
              ================================================= */

              <form onSubmit={verifyOtp} className="space-y-5">

                <div className="text-center mb-6">

                  <div className="w-16 h-16 rounded-2xl bg-[#FBBF24]/15 flex items-center justify-center mx-auto mb-4">

                    <Mail
                      size={28}
                      className="text-[#14213D]"
                    />

                  </div>

                  <h2 className="text-xl font-bold text-[#14213D]">
                    Check your inbox
                  </h2>

                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    We've sent a 6-digit verification code to
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800 break-all">
                    {email}
                  </p>

                </div>


                {/* OTP */}
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                    Verification Code
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, ''))
                    }
                    className="w-full h-14 rounded-xl border border-gray-200 bg-gray-50 px-4 text-center text-2xl font-bold tracking-[0.45em] text-[#14213D] outline-none focus:bg-white focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D]/10"
                    placeholder="000000"
                    required
                  />

                </div>


                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 text-center">
                    {error}
                  </div>
                )}


                {/* Verify */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#14213D] text-white text-sm font-semibold hover:bg-[#0f172a] transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={17} />
                      Verify Email
                    </>
                  )}
                </button>


                {/* Resend */}
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={resendLoading}
                  className="w-full text-sm font-semibold text-[#14213D] hover:text-[#F59E0B] transition disabled:opacity-60"
                >
                  {resendLoading
                    ? 'Sending new code...'
                    : 'Didn’t receive the code? Resend'}
                </button>

              </form>

            )}


            {/* =================================================
                GOOGLE LOGIN
            ================================================= */}

            {step === 'form' && (
              <>
                <div className="flex items-center gap-4 my-7">

                  <div className="h-px flex-1 bg-gray-200" />

                  <span className="text-xs font-medium text-gray-400 uppercase">
                    Or continue with
                  </span>

                  <div className="h-px flex-1 bg-gray-200" />

                </div>

                <div
                  id="google-signup-button"
                  className="w-full flex justify-center"
                />

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheck size={14} />
                  Secure account authentication
                </div>
              </>
            )}


            {/* =================================================
                LOGIN
            ================================================= */}

            <div className="mt-7 pt-6 border-t border-gray-100 text-center">

              <p className="text-sm text-gray-500">
                Already have an account?{' '}

                <button
                  type="button"
                  onClick={() => navigate('/dashboard/client-login')}
                  className="font-semibold text-[#14213D] hover:text-[#F59E0B] transition"
                >
                  Sign in
                </button>
              </p>

            </div>

          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-5">
          © {new Date().getFullYear()} Ceylon Properties. All rights reserved.
        </p>

      </div>

    </div>
  )
}

export default UserSignUp

