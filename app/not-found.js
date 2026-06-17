'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  
 
  useEffect(() => {
    document.title = 'StudyNook – Page Not Found';
  }, []);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 page-wrapper">
      
      {/* Decorative Core Node Representation */}
      <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-100/50 dark:border-emerald-900/30 shadow-sm animate-bounce-slow">
        <Compass className="w-11 h-11 text-emerald-500 dark:text-emerald-400" />
      </div>
      
      {/* Structural Status Codes */}
      <h1 className="font-display text-8xl font-black text-emerald-600 dark:text-emerald-400 mb-2 tracking-tighter">
        404
      </h1>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
        Workspace Node Absent
      </h2>
      
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 text-sm leading-relaxed">
        The route identifier you executed might have been shifted, flushed, or never mapped inside our network distribution directory.
      </p>
      
      {/* Safe Return Trigger Action */}
      <Link href="/" className="btn-primary ripple inline-flex items-center gap-2 text-sm shadow-md shadow-emerald-600/10">
        <Home className="w-4 h-4" /> Return to Dashboard
      </Link>
      
    </div>
  );
}