import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, ArrowLeft, Zap } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function UserLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/wanted'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)

  const saveUser = (data) => {
    localStorage.setItem('userToken', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const handleSignInSuccess = (data) => {
    saveUser(data)
    navigate(redirectPath)
  }

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
          body: JSON.stringify({ id_token: response.credential }),
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

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    const initializeGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
        })

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
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
        body: JSON.stringify({ email, password }),
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

  const handleGoogleLogin = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt()
      return
    }

    setError('Google sign-in is not available right now. Please refresh the page.')
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
         
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">Welcome back</h1>
        
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Enter password"
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
            {loading ? 'Signing in...' : 'Sign in with email'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">or</div>

        <div id="google-signin-button" className="mt-4"></div>

       

        {showSignupPrompt ? (
          <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-[#FEF3C7] px-4 py-3 text-sm text-[#92400E]">
            <p className="mb-2 font-medium">Login failed.</p>
            <p className="mb-3">If you do not have an account yet, please sign up first.</p>
            <button
              type="button"
              onClick={() => navigate('/dashboard/client-register')}
              className="inline-flex items-center justify-center rounded-2xl bg-[#14213D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f172a] transition"
            >
              Sign up now
            </button>
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-gray-500">
            <p className="mt-3 text-sm text-gray-500">
              You haven’t an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/user-signup')}
                className="font-semibold text-[#14213D] hover:underline"
              >
                Sign up
              </button>
            </p>
          </p>
        )}
      </div>
    </div>
  )
}

export default UserLogin
