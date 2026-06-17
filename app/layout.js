import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ThemeProvider from '../components/ThemeProvider';
import './globals.css';

export const metadata = {
  title: 'StudyNook – Library Study Room Booking',
  description: 'Browse and book quiet, private study rooms in your library. List your own room and earn.',
};

export default function RootLayout({ children: applicationViewNodes }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col transition-colors duration-300">
          <ThemeProvider>
            {/* Navigation Header Block */}
            <Navbar />
            
            {/* Core Application Viewport Node Wrapper */}
            <main className="flex-1 page-wrapper">
              {applicationViewNodes}
            </main>
            
            {/* Persistent Structural Footer */}
            <Footer />
            
            {/* Global Notification Feedback Distribution Engine */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: { 
                  borderRadius: '0.75rem', 
                  fontFamily: 'Inter, sans-serif', 
                  fontSize: '14px',
                  background: 'var(--toast-bg, #fff)',
                  color: 'var(--toast-color, #1f2937)'
                },
                success: { 
                  iconTheme: { 
                    primary: '#059669', // Aligned seamlessly with emerald-600 palette configuration
                    secondary: '#ffffff' 
                  } 
                },
                error: { 
                  iconTheme: { 
                    primary: '#ef4444', 
                    secondary: '#ffffff' 
                  } 
                },
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}