export default function LoadingSpinner({ size: explicitComponentSize = 'md', text: displayStatusMessage = 'Loading...' }) {
  
  // Matrix dictionary holding predefined scalable dimensions layout
  const dimensionSizingManifest = { 
    sm: 'w-6 h-6 border-2', 
    md: 'w-10 h-10 border-4', 
    lg: 'w-14 h-14 border-4' 
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 page-wrapper">
      
      {/* Dynamic Animated Core Spin Element Vector */}
      <div 
        className={`${dimensionSizingManifest[explicitComponentSize] || dimensionSizingManifest.md} border-emerald-100 dark:border-emerald-950/60 border-t-emerald-600 rounded-full animate-spin shadow-sm`} 
      />
      
      {/* Optional Procedural Runtime Informational Text String */}
      {displayStatusMessage && (
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold tracking-wide animate-pulse">
          {displayStatusMessage}
        </p>
      )}
      
    </div>
  );
}