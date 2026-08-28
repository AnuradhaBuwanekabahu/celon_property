import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(name, password);
      navigate('/superadmin/');
    } catch (err) {
      setError(err.message || 'Sign in failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 shell:grid-cols-2 bg-[#F6F1E6] font-body selection:bg-[#14213D] selection:text-white">
      {/* Left Branding Panel */}
      <div className="hidden shell:flex relative overflow-hidden flex-col justify-between p-12 lg:p-16 bg-[#14213D] text-[#F6F1E6]">
        {/* Subtle grid pattern background overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(201, 162, 39, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(20, 33, 61, 0.4) 0%, transparent 50%),
              repeating-linear-gradient(to bottom, transparent, transparent 39px, rgba(246, 241, 230, 0.08) 40px),
              repeating-linear-gradient(to right, transparent, transparent 39px, rgba(246, 241, 230, 0.08) 40px)
            `,
          }}
        />

        {/* Ambient Decorative Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#1f335c]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#C9A227]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="mb-2">
            <span className="font-display text-3xl font-bold tracking-tight text-[#F6F1E6]">
              Ceylone
            </span>
            <span className="text-[#C9A227] font-bold text-2xl leading-none">.</span>
          </div>
          <p className="text-[11px] font-semibold text-[#C9A227] tracking-[0.2em] uppercase pl-0.5">
            Property Register • Super Admin
          </p>
        </div>

        {/* Middle Value Proposition Hero */}
        <div className="relative z-10 my-auto py-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#C9A227] font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unified Property Management Portal</span>
          </div>

          <h2 className="font-display text-3xl xl:text-4xl font-bold leading-tight mb-4 text-[#F6F1E6]">
            Complete Control &amp; Insight Across Every Island Property.
          </h2>
          <p className="text-[#F6F1E6]/75 text-sm leading-relaxed mb-8">
            Manage hot sales, rentals, land registries, client subscriptions, and system-wide admin permissions from a single encrypted command center.
          </p>

          {/* Feature Badges */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-[#14213D] border border-white/10 flex items-center justify-center text-[#C9A227]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F6F1E6]">Role-Based Access Security</h4>
                <p className="text-[11.5px] text-[#F6F1E6]/60">Strict authentication guards &amp; audit tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-[#14213D] border border-white/10 flex items-center justify-center text-[#C9A227]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F6F1E6]">Real-Time Listing Management</h4>
                <p className="text-[11.5px] text-[#F6F1E6]/60">Instant verification &amp; status enforcement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Note */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#F6F1E6]/50 border-t border-white/10 pt-6">
          <span>&copy; {new Date().getFullYear()} Ceylone Real Estate</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            System Operational
          </span>
        </div>
      </div>

      {/* Right Login Form Container */}
      <div className="flex flex-col justify-between items-center p-6 sm:p-10 shell:p-16 bg-[#F6F1E6] relative overflow-hidden">
        {/* Soft Background Accent */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#14213D]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Mobile Header Brand */}
        <div className="shell:hidden w-full max-w-md pt-4 pb-6">
          <div className="font-display text-xl font-bold text-ink">Ceylone Property</div>
          <div className="text-[10px] font-bold text-[#14213D] tracking-wider uppercase">Super Admin Portal</div>
        </div>

        {/* Form Main Card */}
        <div className="w-full max-w-[420px] my-auto">
          <div className="bg-surface p-8 sm:p-10 rounded-2xl border border-line shadow-xl shadow-ink/5 relative backdrop-blur-sm">
            {/* Header */}
            <div className="mb-8 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14213D]/10 text-[#14213D] text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Super Admin Authorization</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-ink-soft mt-1.5">
                Sign in with your administrative credentials to continue.
              </p>
            </div>

            {/* Error Notification Alert */}
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-danger-bg border border-danger/20 text-danger text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-5" onSubmit={submit}>
              {/* Admin Name Field */}
              <div>
                <label className="block text-xs font-medium text-ink-soft mb-1.5" htmlFor="name">
                  Admin Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-soft/60 group-focus-within:text-[#14213D] transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface border border-line rounded-xl text-xs sm:text-sm font-body text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D]/20 transition-all"
                    placeholder="Enter admin name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-ink-soft" htmlFor="password">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-soft/60 group-focus-within:text-[#14213D] transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-11 py-2.5 bg-surface border border-line rounded-xl text-xs sm:text-sm font-body text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-[#14213D] focus:ring-2 focus:ring-[#14213D]/20 transition-all"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink-soft/60 hover:text-ink transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#14213D] hover:bg-[#0d1629] text-white font-medium text-xs sm:text-sm rounded-xl shadow-md shadow-[#14213D]/20 hover:shadow-lg hover:shadow-[#14213D]/30 focus:outline-none focus:ring-2 focus:ring-[#14213D]/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-line text-center text-xs text-ink-soft">
              Need an admin account?{' '}
              <Link 
                to="/admin-portal/register" 
                className="text-[#14213D] font-semibold hover:underline transition-colors"
              >
                Register here
              </Link>
            </div>
          </div>
        </div>

        {/* Security badge at bottom */}
        <div className="py-4 text-center">
          <p className="text-[11px] text-ink-soft/70 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-[#14213D]" />
            <span>256-Bit SSL Encrypted Admin Portal</span>
          </p>
        </div>
      </div>
    </div>
  );
}