'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { Moon, Sun, BookOpen, Menu, X } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
  const { isSignedIn: isUserSessionValidated, user: activeProfileContext } = useUser();
  const { theme: activeVisualTheme, toggleTheme: executeThemeTransition } = useTheme();
  const activeApplicationPathname = usePathname();
  const [mobileNavigationMenuOpen, setMobileNavigationMenuOpen] = useState(false);

  // Dynamic distribution matrix mapping layout permissions across authentication lifecycle
  const coreStructuralLinks = [
    { targetRoute: '/', linkDisplayTitle: 'Home' },
    { targetRoute: '/rooms', linkDisplayTitle: 'Rooms' },
    ...(isUserSessionValidated ? [
      { targetRoute: '/add-room', linkDisplayTitle: 'Add Room' },
      { targetRoute: '/my-listings', linkDisplayTitle: 'My Listings' },
      { targetRoute: '/my-bookings', linkDisplayTitle: 'My Bookings' },
    ] : []),
  ];

  // Evaluate matching paths across contextual node boundaries
  const evaluateActivePathContext = (targetEvaluationRoute) => 
    targetEvaluationRoute === '/' 
      ? activeApplicationPathname === '/' 
      : activeApplicationPathname.startsWith(targetEvaluationRoute);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm page-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Frame Cluster */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/10 transition-shadow duration-300">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-black text-xl text-gray-900 dark:text-white tracking-tight">
              Study<span className="text-emerald-600 dark:text-emerald-400">Nook</span>
            </span>
          </Link>

          {/* Desktop Navigation Gateway Menu */}
          <div className="hidden md:flex items-center gap-1">
            {coreStructuralLinks.map((navigationNodeItem) => (
              <Link
                key={navigationNodeItem.targetRoute}
                href={navigationNodeItem.targetRoute}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 
                  ${evaluateActivePathContext(navigationNodeItem.targetRoute)
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                {navigationNodeItem.linkDisplayTitle}
              </Link>
            ))}
          </div>

          {/* Core Action Trigger Distribution Row */}
          <div className="flex items-center gap-3">
            <button
              onClick={executeThemeTransition}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 active:scale-95 border border-transparent dark:hover:border-gray-700/40"
              aria-label="Toggle theme"
            >
              {activeVisualTheme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {isUserSessionValidated ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 font-semibold select-none">
                  {activeProfileContext?.firstName}
                </span>
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'w-8 h-8 rounded-xl ring-2 ring-emerald-500/20' } }} />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <SignInButton mode="modal">
                  <button className="btn-secondary py-2 px-4 text-sm font-semibold">Login</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-primary py-2 px-4 text-sm font-semibold ripple shadow-md shadow-emerald-600/10">Register</button>
                </SignUpButton>
              </div>
            )}

            {/* Mobile Adaptive Trigger Controller */}
            <button
              onClick={() => setMobileNavigationMenuOpen(!mobileNavigationMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent dark:hover:border-gray-700/40"
            >
              {mobileNavigationMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Adaptive Mobile Pipeline Shell Drawer */}
      {mobileNavigationMenuOpen && (
        <div className="md:hidden pb-4 pt-2 border-t border-gray-100 dark:border-gray-800/60 space-y-1 animate-slide-up bg-white dark:bg-gray-900 px-4">
          {coreStructuralLinks.map((navigationNodeItem) => (
            <Link
              key={navigationNodeItem.targetRoute}
              href={navigationNodeItem.targetRoute}
              onClick={() => setMobileNavigationMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
                ${evaluateActivePathContext(navigationNodeItem.targetRoute)
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
              {navigationNodeItem.linkDisplayTitle}
            </Link>
          ))}
          {!isUserSessionValidated && (
            <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800/40 mt-3">
              <SignInButton mode="modal">
                <button className="flex-1 btn-secondary py-2.5 text-sm font-semibold" onClick={() => setMobileNavigationMenuOpen(false)}>Login</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex-1 btn-primary py-2.5 text-sm font-semibold ripple" onClick={() => setMobileNavigationMenuOpen(false)}>Register</button>
              </SignUpButton>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}