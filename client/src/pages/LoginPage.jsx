import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Mail, Lock, Eye, EyeOff, Zap, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">

        {/* ── Left: Branding Panel ── */}
        <div className="hidden lg:flex flex-col items-start justify-center p-10 rounded-3xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #5b4de0 100%)' }}>
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-20"
            style={{ background: 'rgba(255,255,255,0.3)' }} />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10"
            style={{ background: 'rgba(255,255,255,0.5)' }} />

          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8 shadow-lg backdrop-blur-sm">
            <Zap className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Boost Your<br />Productivity
          </h2>
          <p className="text-base text-white/75 leading-relaxed mb-8 max-w-xs">
            Join thousands of students who use TaskFlow to stay organized,
            focused, and crush their academic goals.
          </p>

          {/* Stats row */}
          <div className="flex gap-6">
            {[
              { label: 'Active Users', value: '10K+' },
              { label: 'Tasks Done', value: '250K+' },
              { label: 'Avg. Rating', value: '4.9★' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/60 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-white/70">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Servers online & running</span>
          </div>
        </div>

        {/* ── Right: Login Card ── */}
        <div className="w-full max-w-md mx-auto">
          <div
            className="rounded-3xl p-8 shadow-2xl"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            {/* Logo mark */}
            <div className="text-center mb-8">
              <div
                className="w-14 h-14 rounded-2xl grid place-items-center text-white text-2xl mx-auto mb-5 shadow-lg"
                style={{ background: 'linear-gradient(135deg, var(--accent), #5b4de0)' }}
              >
                ✦
              </div>
              <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
                Welcome back
              </h1>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-2)' }}>
                Sign in to continue your productivity journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold" style={{ color: 'var(--text-2)' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: 'var(--text-3)' }}
                  />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    autoComplete="email"
                    autoFocus
                    required
                    className="input-base pl-9"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold" style={{ color: 'var(--text-2)' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold transition-colors"
                    style={{ color: 'var(--accent)' }}
                    onMouseEnter={e => e.target.style.color = 'var(--accent-3)'}
                    onMouseLeave={e => e.target.style.color = 'var(--accent)'}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: 'var(--text-3)' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    autoComplete="current-password"
                    required
                    className="input-base pl-9 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--text-3)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-2)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div
                  className="flex items-center gap-2.5 text-sm font-medium px-4 py-3 rounded-xl"
                  style={{
                    background: 'var(--high-bg)',
                    color: 'var(--high)',
                    border: '1px solid var(--high)',
                  }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                loading={loading}
                className="w-full justify-center py-3 text-base"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            {/* Register link */}
            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-bold transition-colors"
                  style={{ color: 'var(--accent)' }}
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
