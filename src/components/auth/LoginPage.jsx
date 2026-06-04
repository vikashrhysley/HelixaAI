import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { loginUser } from '../../utils/authService';
import { useTheme } from '../../hooks/useTheme';

export default function LoginPage({ onShowSignup, notice = '', initialIdentifier = '' }) {
  const dispatch = useDispatch();
  const { dark, bg, text, muted, border, input: inputClass } = useTheme();
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const pageBg = dark
    ? 'radial-gradient(circle at 50% 18%, rgba(99,102,241,0.18), transparent 32%), radial-gradient(circle at 18% 78%, rgba(139,92,246,0.12), transparent 30%), #0A0A0A'
    : undefined;
  const panelClass = dark
    ? 'border-white/15 bg-[rgba(52,52,52,0.46)] shadow-[0_24px_80px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[22px] backdrop-saturate-150'
    : `${border} bg-white`;
  const fieldClass = dark
    ? 'border-white/15 bg-white/10'
    : `${border} ${inputClass}`;
  const inputBase = `w-full rounded-[10px] border-[1.5px] py-[11px] pl-10 pr-3.5 font-sans text-[14.5px] outline-none transition-colors placeholder:text-[#7878a0] focus:border-[#6366f1] ${fieldClass} ${text}`;
  const iconClass = `pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${muted}`;

  useEffect(() => {
    setIdentifier(initialIdentifier);
  }, [initialIdentifier]);

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser({ username: identifier.trim(), password });
      dispatch(login({
        user: {
          ...data.user,
          name: data.user?.username,
        },
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
      }));
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center p-4 font-sans ${dark ? '' : bg}`} style={dark ? { background: pageBg } : undefined}>
      <div className={`w-full max-w-[420px] animate-fadeUp rounded-[20px] border-[1.5px] px-8 py-10 ${panelClass}`}>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" stroke="white" strokeWidth="2"/><circle cx="10" cy="12.5" r="2" fill="white"/><circle cx="18" cy="12.5" r="2" fill="white"/><path d="M10 18c1.2 1.5 6.8 1.5 8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <h1 className={`font-display text-2xl font-bold ${text}`}>Welcome to Chathelix</h1>
          <p className={`mt-1.5 text-sm ${muted}`}>Sign in to start chatting</p>
        </div>

        <form onSubmit={handle} className="flex flex-col gap-3.5">
          <div>
            <label className={`mb-1.5 block text-[13px] font-medium ${muted}`}>User name or Email ID</label>
            <div className="relative">
              <svg className={iconClass} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input className={inputBase} type="text" placeholder="username or email@example.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required/>
            </div>
          </div>
          <div>
            <label className={`mb-1.5 block text-[13px] font-medium ${muted}`}>Password</label>
            <div className="relative">
              <svg className={iconClass} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
              <input className={`${inputBase} pr-11`} type={showPass ? 'text' : 'password'} placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required/>
              <button type="button" onClick={() => setShowPass((p) => !p)} className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0.5 ${muted}`}>
                {showPass
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>
          {notice && <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-[13px] text-emerald-500">{notice}</p>}
          {error && <p className="rounded-lg bg-red-950/20 px-3 py-2 text-[13px] text-red-400">{error}</p>}
          <button className="mt-1 w-full cursor-pointer rounded-[10px] border-0 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] p-3 font-sans text-[15px] font-semibold text-white shadow-[0_10px_28px_rgba(99,102,241,0.28)] transition hover:opacity-90 active:translate-y-px disabled:cursor-default disabled:opacity-60" type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"/>
                Signing in...
              </span>
            ) : 'Sign in'}
          </button>
        </form>
        <p className={`mt-5 text-center text-[13px] ${muted}`}>
          Don't have an account?{' '}
          <button type="button" onClick={onShowSignup} className="cursor-pointer border-0 bg-transparent p-0 font-medium text-[#6366f1] hover:text-[#8b5cf6]">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

