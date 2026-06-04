import { useState } from 'react';
import { signupUser } from '../../utils/authService';
import { useTheme } from '../../hooks/useTheme';

export default function SignupPage({ onShowLogin, onSignupSuccess }) {
  const { dark, bg, text, muted, border, input: inputClass } = useTheme();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const pageBg = dark
    ? 'radial-gradient(circle at 50% 18%, rgba(99,102,241,0.18), transparent 32%), radial-gradient(circle at 18% 78%, rgba(139,92,246,0.12), transparent 30%), #0A0A0A'
    : undefined;
  const panelClass = dark
    ? 'border-white/15 bg-[rgba(52,52,52,0.46)] shadow-[0_24px_80px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[22px] backdrop-saturate-150'
    : `${border} bg-white`;
  const fieldClass = dark
    ? 'border-white/15 bg-white/10'
    : `${border} ${inputClass}`;
  const inputBase = `w-full rounded-[10px] border-[1.5px] px-3.5 py-[11px] font-sans text-[14.5px] outline-none transition-colors placeholder:text-[#7878a0] focus:border-[#6366f1] ${fieldClass} ${text}`;

  const setFieldValue = (setter, field) => (event) => {
    setter(event.target.value);
    setErrors((current) => ({ ...current, [field]: '' }));
    setFormError('');
  };

  const validate = () => {
    const nextErrors = {};
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();

    if (!trimmedEmail) {
      nextErrors.email = 'Email ID is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!trimmedName) {
      nextErrors.name = 'Name is required.';
    } else if (trimmedName.length < 2) {
      nextErrors.name = 'Name must be at least 2 characters.';
    }

    if (!trimmedUsername) {
      nextErrors.username = 'User name is required.';
    } else if (trimmedUsername.length < 3) {
      nextErrors.username = 'User name must be at least 3 characters.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      nextErrors.username = 'Use only letters, numbers, and underscores.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirm password is required.';
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Confirm password must match password.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handle = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await signupUser({
        email: email.trim(),
        fullname: name.trim(),
        username: username.trim(),
        password,
        confirmPassword,
      });
      onSignupSuccess(username.trim());
    } catch (err) {
      setFormError(err.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ message }) => (
    message ? <p className="mt-1.5 text-[12.5px] text-red-400">{message}</p> : null
  );

  const EyeButton = ({ visible, onClick }) => (
    <button type="button" onClick={onClick} className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0.5 ${muted}`} aria-label={visible ? 'Hide password' : 'Show password'}>
      {visible
        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  );

  return (
    <div className={`flex min-h-screen items-center justify-center p-4 font-sans ${dark ? '' : bg}`} style={dark ? { background: pageBg } : undefined}>
      <div className={`w-full max-w-[460px] animate-fadeUp rounded-[20px] border-[1.5px] px-8 py-9 ${panelClass}`}>
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" stroke="white" strokeWidth="2"/><circle cx="10" cy="12.5" r="2" fill="white"/><circle cx="18" cy="12.5" r="2" fill="white"/><path d="M10 18c1.2 1.5 6.8 1.5 8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <h1 className={`font-display text-2xl font-bold ${text}`}>Create your account</h1>
          <p className={`mt-1.5 text-sm ${muted}`}>Start chatting with Chathelix</p>
        </div>

        <form onSubmit={handle} className="flex flex-col gap-3.5" noValidate>
          <div>
            <label className={`mb-1.5 block text-[13px] font-medium ${muted}`}>Email ID</label>
            <input className={inputBase} type="email" placeholder="you@example.com" value={email} onChange={setFieldValue(setEmail, 'email')} aria-invalid={Boolean(errors.email)}/>
            <FieldError message={errors.email}/>
          </div>
          <div>
            <label className={`mb-1.5 block text-[13px] font-medium ${muted}`}>Name</label>
            <input className={inputBase} type="text" placeholder="Your full name" value={name} onChange={setFieldValue(setName, 'name')} aria-invalid={Boolean(errors.name)}/>
            <FieldError message={errors.name}/>
          </div>
          <div>
            <label className={`mb-1.5 block text-[13px] font-medium ${muted}`}>User name</label>
            <input className={inputBase} type="text" placeholder="helix_user" value={username} onChange={setFieldValue(setUsername, 'username')} aria-invalid={Boolean(errors.username)}/>
            <FieldError message={errors.username}/>
          </div>
          <div>
            <label className={`mb-1.5 block text-[13px] font-medium ${muted}`}>Password</label>
            <div className="relative">
              <input className={`${inputBase} pr-11`} type={showPassword ? 'text' : 'password'} placeholder="********" value={password} onChange={setFieldValue(setPassword, 'password')} aria-invalid={Boolean(errors.password)}/>
              <EyeButton visible={showPassword} onClick={() => setShowPassword((value) => !value)}/>
            </div>
            <FieldError message={errors.password}/>
          </div>
          <div>
            <label className={`mb-1.5 block text-[13px] font-medium ${muted}`}>Confirm password</label>
            <div className="relative">
              <input className={`${inputBase} pr-11`} type={showConfirmPassword ? 'text' : 'password'} placeholder="********" value={confirmPassword} onChange={setFieldValue(setConfirmPassword, 'confirmPassword')} aria-invalid={Boolean(errors.confirmPassword)}/>
              <EyeButton visible={showConfirmPassword} onClick={() => setShowConfirmPassword((value) => !value)}/>
            </div>
            <FieldError message={errors.confirmPassword}/>
          </div>

          {formError && <p className="rounded-lg bg-red-950/20 px-3 py-2 text-[13px] text-red-400">{formError}</p>}

          <button className="mt-1 w-full cursor-pointer rounded-[10px] border-0 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] p-3 font-sans text-[15px] font-semibold text-white shadow-[0_10px_28px_rgba(99,102,241,0.28)] transition hover:opacity-90 active:translate-y-px disabled:cursor-default disabled:opacity-60" type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"/>
                Creating account...
              </span>
            ) : 'Create account'}
          </button>
        </form>

        <p className={`mt-4 text-center text-[13px] ${muted}`}>
          Already have an account?{' '}
          <button type="button" onClick={onShowLogin} className="cursor-pointer border-0 bg-transparent p-0 font-medium text-[#6366f1] hover:text-[#8b5cf6]">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

