'use client';
import { useEffect } from 'react';
import { SignUp } from '@clerk/nextjs';
import { Compass, Sparkles, Wifi, ShieldCheck } from 'lucide-react';

export default function SignUpPage() {
  
  
  useEffect(() => {
    document.title = 'StudyNook – Create Account';
  }, []);

  return (
    <div className="min-h-[85vh] grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden card border-none shadow-xl max-w-6xl mx-auto my-6 bg-white dark:bg-gray-900">
      
      {/* Left Column: Premium Visual Branding Sidebar */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-teal-700 via-emerald-600 to-emerald-950 p-12 flex-col justify-between overflow-hidden">
        {/* Dynamic ambient vector rings to simulate structural elevation */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
        <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-emerald-400/20 rounded-full blur-2xl -ml-28 pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 border border-white/10 rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <span className="font-display font-bold text-xl text-white tracking-wide">StudyNook</span>
        </div>

        <div className="relative z-10 my-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-medium text-emerald-100 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Premium Study Zones
          </div>
          <h2 className="font-display text-4xl font-extrabold text-white leading-tight">
            Unlock your potential in absolute peace.
          </h2>
          
          <div className="flex items-start gap-3 pt-2 text-emerald-100/90">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Wifi className="w-4 h-4 text-emerald-300" />
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              <strong>Instant Wi-Fi & Focused Infrastructure:</strong> Book instantly and gain access to fully equipped smart study layouts.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center gap-3 text-xs text-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-300 flex-shrink-0" />
          <span>Secure enterprise-grade single sign-on security network.</span>
        </div>
      </div>

      {/* Right Column: Registration Matrix Hub */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-12 bg-gray-50/50 dark:bg-gray-800/40 backdrop-blur-sm">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center lg:text-left mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              Create your account
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Join StudyNook today and start booking elite local study environments instantly.
            </p>
          </div>

          <div className="flex justify-center lg:justify-start security-card-wrapper">
            {/* Clerk Custom Variable Theme Injection Override */}
            <SignUp 
              afterSignUpUrl="/" 
              appearance={{
                elements: {
                  rootBox: "w-full shadow-none",
                  card: "bg-transparent dark:bg-transparent shadow-none p-0 w-full border-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 font-medium text-sm py-2.5",
                  formButtonPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 text-sm font-semibold shadow-sm transition-all duration-200",
                  formFieldInput: "input-field bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-emerald-500 rounded-xl",
                  footerActionLink: "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-semibold",
                  dividerText: "text-gray-400 text-xs uppercase tracking-wider",
                  dividerLine: "bg-gray-100 dark:bg-gray-700"
                }
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}