import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowLeft, Zap } from 'lucide-react'

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
    navigate('/wanted')
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
      if (!res.ok || !data.success) throw new Error(data.message || 'Verification failed')
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
      if (!res.ok || !data.success) throw new Error(data.message || 'Could not resend OTP')
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
          body: JSON.stringify({ id_token: response.credential }),
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
        body: JSON.stringify({ full_name: fullName, email, password }),
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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-8">
          
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">Create your account</h1>
          <p className="text-gray-500">
            Sign up with email/password or continue with Google.
          </p>
        </div>

        {step === 'form' ? <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-[#14213D] focus-within:ring-1 focus-within:ring-[#14213D]">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-0 bg-transparent text-sm text-gray-900 outline-none"
                placeholder="Your full name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-[#14213D] focus-within:ring-1 focus-within:ring-[#14213D]">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-0 bg-transparent pl-11 text-sm text-gray-900 outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-[#14213D] focus-within:ring-1 focus-within:ring-[#14213D]">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-0 bg-transparent pl-11 text-sm text-gray-900 outline-none"
                placeholder="Create a password"
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#14213D] px-5 py-3 text-white text-sm font-semibold hover:bg-[#0f172a] transition disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Sign up with email'}
          </button>
        </form> : <form onSubmit={verifyOtp} className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Verify your email</h2>
            <p className="mt-2 text-sm text-gray-500">Enter the 6-digit code sent to {email}.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verification code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-lg tracking-[0.5em] outline-none focus:border-[#14213D] focus:ring-1 focus:ring-[#14213D]"
              placeholder="000000"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#14213D] px-5 py-3 text-white text-sm font-semibold hover:bg-[#0f172a] transition disabled:opacity-60"
          >
            {loading ? 'Verifying...' : 'Verify email'}
          </button>

          <button type="button" onClick={resendOtp} disabled={resendLoading} className="w-full text-sm font-semibold text-[#14213D] hover:underline disabled:opacity-60">
            {resendLoading ? 'Sending...' : 'Resend code'}
          </button>
        </form>}

        <div className="mt-6 text-center text-sm text-gray-500">or</div>

        <div id="google-signup-button" className="mt-4"></div>

       
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <button type="button" onClick={() => navigate('/user-login')} className="font-semibold text-[#14213D]">Sign in</button>
        </p>
      </div>
    </div>
  )
}

export default UserSignUp
