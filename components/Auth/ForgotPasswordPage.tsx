import React, { useState } from 'react';
import AuthLayout from './AuthLayout';

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <AuthLayout title="Check Inbox" subtitle="Recovery Initiated">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-bgMain rounded-full border border-borderColor flex items-center justify-center mx-auto mb-6 text-red-600">
             <iconify-icon icon="solar:shield-check-linear" width="32"></iconify-icon>
          </div>
          <p className="text-textMuted text-sm font-medium leading-relaxed mb-8">
            Instructions to reset your password have been sent to <span className="text-textMain font-bold">{email}</span>.
          </p>
          <button 
            onClick={() => onNavigate('login')}
            className="w-full py-4 bg-bgMain hover:bg-bgMain/80 border border-borderColor text-textMain rounded-sm font-black uppercase tracking-[0.2em] text-[10px] transition-all"
          >
            Return to Login
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Password Reset" subtitle="Account Recovery">
      <p className="text-textMuted text-xs font-medium leading-relaxed mb-8 border-l-2 border-red-600 pl-4">
        Enter your registered email address below. We will send you a secure link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[9px] font-black text-textMuted/80 uppercase tracking-widest">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textMuted">
               <iconify-icon icon="solar:letter-linear" width="16"></iconify-icon>
            </div>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bgMain border border-borderColor rounded-sm pl-10 pr-4 py-3.5 focus:border-textMuted outline-none transition-all text-xs font-bold uppercase tracking-widest text-textMain placeholder:text-textMuted/30"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full py-4 bg-red-600 text-white hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-sm font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-lg active:scale-[0.98]"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-8 text-center pt-8 border-t border-borderColor/50">
        <button 
          onClick={() => onNavigate('login')}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-textMuted hover:text-textMain transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <iconify-icon icon="solar:arrow-left-linear" width="14"></iconify-icon>
          Back to Login
        </button>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;