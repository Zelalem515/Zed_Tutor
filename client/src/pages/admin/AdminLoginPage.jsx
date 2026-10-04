import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to the page the user was trying to reach, or /admin (dashboard)
  const from = location.state?.from?.pathname || '/admin';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-navy-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-3">
            {logoFailed ? (
              /* Fallback: gradient box if logo fails to load */
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-academic-600 to-academic-400 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                ZT
              </div>
            ) : (
              <img
                src="/assets/branding/logo.png"
                alt="ZED_Tutor"
                className="h-16 w-auto object-contain"
                onError={() => setLogoFailed(true)}
              />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white">ZED_Tutor Admin Portal</h1>
          <p className="text-xs text-slate-400">Authenticated access for Zelalem Birhan</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-academic-500"
              placeholder="admin@zedtutor.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-academic-500"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-navy-950 bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-500 hover:to-amber-600 transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In as Admin'}</span>
            <ArrowRight className="w-4 h-4 text-navy-950" />
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-500">
          Use your configured admin credentials to sign in.
        </p>

      </div>
    </div>
  );
}
