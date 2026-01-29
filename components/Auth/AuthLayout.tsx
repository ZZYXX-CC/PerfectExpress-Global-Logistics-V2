import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-bgMain">
      {/* Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute w-full h-full" style={{ backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-bgMain to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-10">
             <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-bgSurface border border-borderColor rounded-sm flex items-center justify-center">
                  <iconify-icon icon="solar:lock-password-linear" width="16" class="text-red-600"></iconify-icon>
                </div>
                <span className="metadata-label text-textMuted">Secure Portal</span>
             </div>
             <h2 className="text-3xl font-extrabold heading-font uppercase tracking-tighter text-textMain mb-2">{title}</h2>
             <p className="text-textMuted text-xs font-medium uppercase tracking-wider">{subtitle}</p>
          </div>

          <div className="bg-bgSurface/60 backdrop-blur-xl border border-borderColor rounded-sm p-8 md:p-10 shadow-2xl relative overflow-hidden">
             {/* Decorative Corner */}
             <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-600"></div>
                <div className="absolute top-0 right-2 w-8 h-[1px] bg-red-600/50"></div>
                <div className="absolute top-2 right-0 w-[1px] h-8 bg-red-600/50"></div>
             </div>
             
             {children}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AuthLayout;