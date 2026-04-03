import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/client';
import { Button, TextInput } from '../components/FormControls';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('userName', response.name || '');
      localStorage.setItem('userEmail', response.email);
      localStorage.setItem('userRole', response.role);
      navigate(response.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-5 gap-10 items-start">
      <section className="md:col-span-3 space-y-4">
        <h1 className="text-2xl font-semibold text-gov-primary">
          Secure access to your grievance account
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Use your registered email and password to submit new grievances, track the status of existing complaints, and
          receive updates from the concerned departments. Your information is encrypted and handled as per government
          data protection guidelines.
        </p>
        <ul className="text-sm text-slate-700 space-y-1.5 bg-white/80 border-l-4 border-gov-saffron rounded-md px-4 py-3 shadow-sm">
          <li className="flex items-start gap-2">
            <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-gov-saffron" />
            <span>Submit grievances anytime, from anywhere</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-gov-white border border-slate-300" />
            <span>Transparent tracking of complaint status</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-gov-green" />
            <span>Notifications on resolution and escalation</span>
          </li>
        </ul>
      </section>
      <section className="md:col-span-2 bg-white/95 border border-slate-200 rounded-xl shadow-md p-6 backdrop-blur">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">Login</h2>
        <p className="text-xs text-slate-500 mb-4">For citizens and authorized officials.</p>
        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <TextInput
            label="Email address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Forgot password? Contact your district helpdesk.</span>
          </div>
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in securely'}
          </Button>
        </form>
        <p className="mt-4 text-xs text-slate-600">
          New user?{' '}
          <Link to="/register" className="text-gov-primary font-medium hover:underline">
            Create a citizen account
          </Link>
        </p>
      </section>
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    setOtpLoading(true);
    setError(null);
    try {
      await authApi.sendOtp(email);
      setStep('otp');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register({ name, email, password, phone: phone || undefined, otp });
      localStorage.setItem('token', response.token);
      localStorage.setItem('userName', response.name || '');
      localStorage.setItem('userEmail', response.email);
      localStorage.setItem('userRole', response.role);
      navigate(response.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || 'Registration failed. Please review your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white/95 border border-slate-200 rounded-xl shadow-md p-6 backdrop-blur">
      <h1 className="text-xl font-semibold text-gov-primary mb-1">Create a citizen account</h1>
      <p className="text-xs text-slate-600 mb-4">
        Provide accurate contact details so that officials can reach you if additional information is required.
      </p>
      {error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
      )}
      {step === 'form' ? (
        <form onSubmit={handleSendOtp} className="space-y-3">
          <TextInput label="Full name" required value={name} onChange={(e) => setName(e.target.value)} />
          <TextInput label="Email address" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextInput label="Mobile number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <TextInput label="Password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="text-[11px] text-slate-500">
            By continuing you agree to the portal&apos;s terms of use. You will receive an OTP on your email.
          </p>
          <Button type="submit" className="w-full mt-1" disabled={otpLoading}>
            {otpLoading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-3">
          <p className="text-sm text-slate-600">OTP sent to {email}. Check your inbox (and dev console for OTP in dev mode).</p>
          <TextInput label="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} required />
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep('form')} className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Creating...' : 'Create account'}
            </Button>
          </div>
        </form>
      )}
      <p className="mt-4 text-xs text-slate-600">
        Already registered?{' '}
        <Link to="/login" className="text-gov-primary font-medium hover:underline">
          Go to login
        </Link>
      </p>
    </div>
  );
}

