import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { btn } from '../lib/ui';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(name, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 shell:grid-cols-2 bg-teal-deep">
      <div className="hidden shell:flex relative overflow-hidden flex-col justify-center px-[60px] text-[#F6F1E6]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent, transparent 38px, rgba(246, 241, 230, 0.05) 39px)',
          }}
        />
        <div className="font-display text-[42px] font-bold mb-2.5">Ceylone</div>
        <div className="text-sm text-gold uppercase tracking-[0.14em] mb-[30px]">Property Register</div>
        <p className="max-w-[380px] text-[#F6F1E6]/75 leading-[1.7] text-[14.5px]">
          One register for every listing, client and settlement across the island —
          hot sales, rentals, land and wanted requests, kept in order.
        </p>
      </div>

      <div className="flex items-center justify-center bg-bg">
        <form className="w-full max-w-[360px] p-5" onSubmit={submit}>
          <h1 className="text-2xl mb-1.5">Sign in</h1>
          <div className="text-ink-soft text-[13px] mb-[26px]">Admin &amp; Super Admin access only.</div>

          {error ? (
            <div className="bg-danger-bg text-danger rounded-radius px-3 py-2.5 text-[12.5px] mb-4">{error}</div>
          ) : null}

          <div className="mb-3.5">
            <label className="block text-xs font-medium text-ink-soft mb-[5px]" htmlFor="name">Admin name</label>
            <input
              id="name"
              className="w-full px-2.5 py-2 border border-line rounded-radius text-[13.5px] font-body bg-bg text-ink focus:outline-none focus:border-teal focus:bg-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="mb-3.5">
            <label className="block text-xs font-medium text-ink-soft mb-[5px]" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-2.5 py-2 border border-line rounded-radius text-[13.5px] font-body bg-bg text-ink focus:outline-none focus:border-teal focus:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            className={btn('primary', { extra: 'w-full justify-center py-2.5' })}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
