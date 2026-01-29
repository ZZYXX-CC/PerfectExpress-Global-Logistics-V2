import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-20 bg-bgMain border-t border-borderColor transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-bgSurface border border-borderColor rounded-sm flex items-center justify-center">
                  <iconify-icon icon="solar:delivery-linear" width="24" class="text-red-600"></iconify-icon>
                </div>
                <span className="text-2xl font-extrabold tracking-tighter heading-font uppercase text-textMain">Perfect<span className="text-red-600">Express</span></span>
             </div>
             <p className="text-textMuted text-xs font-medium leading-relaxed max-w-sm">
                Providing easy and reliable shipping solutions for families and businesses worldwide. We focus on getting your packages where they need to be, safely and on time.
             </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-textMuted/70 mb-8">Our Network</h4>
            <ul className="space-y-4 text-[10px] font-bold text-textMuted uppercase tracking-widest">
              <li><a href="#" className="hover:text-red-600 transition-colors">North America</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">European Hubs</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Asia Pacific</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Local Delivery</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-textMuted/70 mb-8">Helpful Links</h4>
            <ul className="space-y-4 text-[10px] font-bold text-textMuted uppercase tracking-widest">
              <li><a href="#" className="hover:text-red-600 transition-colors">Shipping Guide</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Track Package</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Support Center</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-borderColor">
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-textMuted/80">
            <a href="#" className="hover:text-textMain transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-textMain transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-textMain transition-colors">Cookie Settings</a>
          </div>

          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-textMuted/80">
            © 2024 PERFECTEXPRESS GLOBAL SHIPPING. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;