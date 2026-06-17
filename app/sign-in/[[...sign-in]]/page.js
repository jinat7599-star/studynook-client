'use client';
import { useEffect } from 'react';
import { SignIn } from '@clerk/nextjs';
import { ShieldCheck, Sparkles, Compass } from 'lucide-react';

export default function SignInPage() {
  
  // Dynamic tab title assignment to isolate client execution context
  useEffect(() => {
    document.title = 'StudyNook – Secure Authentication';
  }, []);

  return (
    <div className="min-h-[85vh] grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden card border-none shadow-xl max-w-6xl mx-auto my-6 bg-white dark:bg-gray-900">
      
      {/* Left Column: Visual Branding Sidebar (Hidden on Mobile viewports) */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-900 p-12 flex-col justify-between overflow-hidden">
        {/* Decorative background vectors for premium layout depth */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/20 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <span className="font-display font-bold text-xl text-white tracking-wide">StudyNook</span>
        </div>

        <div className="relative z-10 my-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-medium text-primary-100 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Premium Workspace
          </div>
          <h2 className="font-display text-4xl font-extrabold text-white leading-tight">
            Your gateway to focused learning.
          </h2>
          <p className="text-primary-100/80 text-sm leading-relaxed max-w-sm">
            Access elite local study rooms, reserve instant high-speed Wi-Fi zones, and coordinate with thousands of students seamlessly.
          </p>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center gap-3 text-xs text-primary-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Enterprise grade single sign-on security network.</span>
        </div>
      </div>

      {/* Right Column: Dynamic Authentication Center */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-12 bg-gray-50/50 dark:bg-gray-800/40 backdrop-blur-sm">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center lg:text-left mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Sign in to manage your bookings, adjust workspace listings, and track instantaneous revenue streams.
            </p>
          </div>
          
          <div className="flex justify-center lg:justify-start security-card-wrapper">
            {/* Embedded custom class theme for clean background blending */}
            <SignIn 
              afterSignInUrl="/" 
              appearance={{
                elements: {
                  rootBox: "w-full shadow-none",
                  card: "bg-transparent dark:bg-transparent shadow-none p-0 w-full border-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 font-medium text-sm py-2.5",
                  formButtonPrimary: "bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-2.5 text-sm font-semibold shadow-sm transition-all duration-200",
                  formFieldInput: "input-field bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl",
                  footerActionLink: "text-primary-600 dark:text-primary-400 hover:text-primary-700 font-semibold",
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