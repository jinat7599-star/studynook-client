import Link from 'next/link';
import { BookOpen, Mail, Phone, Facebook, Linkedin, Instagram } from 'lucide-react';

const TwitterCustomPlatformIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  const corporateChronologyYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 dark:bg-black text-gray-400 mt-auto border-t border-gray-900/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Identity Distribution Module */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-950/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-black text-xl text-white tracking-tight">
                Study<span className="text-emerald-400">Nook</span>
              </span>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs font-normal">
              Your premium institutional network optimized for booking validated study rooms. Focus deeply, build faster.
            </p>
            
            {/* Interactive Social Synchronization Triggers */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { componentRepresentation: <Facebook className="w-4 h-4" />, platformTarget: '#', IdentityToken: 'Facebook' },
                { componentRepresentation: <TwitterCustomPlatformIcon />, platformTarget: '#', IdentityToken: 'X-Twitter' },
                { componentRepresentation: <Linkedin className="w-4 h-4" />, platformTarget: '#', IdentityToken: 'LinkedIn' },
                { componentRepresentation: <Instagram className="w-4 h-4" />, platformTarget: '#', IdentityToken: 'Instagram' },
              ].map(socialGatewayNode => (
                <a
                  key={socialGatewayNode.IdentityToken}
                  href={socialGatewayNode.platformTarget}
                  aria-label={socialGatewayNode.IdentityToken}
                  className="w-9 h-9 rounded-xl bg-gray-900 text-gray-400 hover:text-white hover:bg-emerald-600 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-gray-800/40"
                >
                  {socialGatewayNode.componentRepresentation}
                </a>
              ))}
            </div>
          </div>

          {/* Directory Routing Navigation Cluster */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { destinationRoute: '/', coreLabel: 'Home' },
                { destinationRoute: '/rooms', coreLabel: 'All Rooms' },
                { destinationRoute: '/add-room', coreLabel: 'List a Room' },
                { destinationRoute: '/my-bookings', coreLabel: 'My Bookings' },
              ].map(navigationLinkItem => (
                <li key={navigationLinkItem.destinationRoute}>
                  <Link href={navigationLinkItem.destinationRoute} className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200 font-medium">
                    {navigationLinkItem.coreLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional Contact Interfaces */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="mailto:hello@studynook.io" className="hover:text-emerald-400 transition-colors font-medium">hello@studynook.io</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="tel:+18005550100" className="hover:text-emerald-400 transition-colors font-medium">+1 (800) 555-0100</a>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Structural Layout Verification Credentials */}
        <div className="border-t border-gray-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-gray-500 font-medium">© {corporateChronologyYear} StudyNook. All rights reserved.</p>
          <p className="text-xs text-gray-500 font-medium tracking-tight">Built with ❤️ for better studying</p>
        </div>
        
      </div>
    </footer>
  );
}