import React, { useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  FirebaseUser,
} from '../lib/firebase';
import { LogIn, LogOut, User, Mail, Lock, Sparkles, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setErrorMsg(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signInAnonymously(auth);
      onClose();
    } catch (err: any) {
      console.error('Guest Sign-In Error:', err);
      setErrorMsg(err.message || 'Failed to sign in as guest');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (err: any) {
      console.error('Sign Out Error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 sm:p-8 space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto border-2 border-teal-200">
              <User className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 inline-block mb-1">
                Authenticated Account
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                {currentUser.displayName || currentUser.email || 'Verified Guest Patient'}
              </h3>
              <p className="text-xs text-slate-500">
                UID: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{currentUser.uid}</code>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2 text-left">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protected Firebase Account</span>
              </div>
              <p>Your appointment bookings are synced directly to your secure Firestore profile.</p>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-3 rounded-2xl text-xs transition-colors cursor-pointer border border-rose-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Account</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 inline-block mb-1">
                Firebase Patient Auth
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                {isRegistering ? 'Create Patient Account' : 'Patient Portal Login'}
              </h3>
              <p className="text-xs text-slate-500">
                Sign in to manage and protect your OPD appointment passes securely.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs">
                {errorMsg}
              </div>
            )}

            {/* Google Quick Sign-In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 px-4 rounded-2xl border border-slate-300 shadow-xs text-xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase">
                Or with email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="patient@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-2xl text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer"
              >
                {isRegistering ? 'Register Patient Account' : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="font-semibold text-teal-600 hover:underline cursor-pointer"
              >
                {isRegistering ? 'Already have account? Sign In' : 'New patient? Register'}
              </button>

              <button
                type="button"
                onClick={handleAnonymousSignIn}
                className="text-slate-500 hover:text-slate-800 cursor-pointer text-[11px]"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
