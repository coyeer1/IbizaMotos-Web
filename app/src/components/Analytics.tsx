import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    // --- Google Analytics Placeholder ---
    // If you plan to add Google Analytics, insert the gtag code here.
    // Ensure you have added the main <script> tag to index.html with your G-XXXXXXX tracking ID.
    
    // Example:
    // if (typeof window.gtag === 'function') {
    //   window.gtag('config', 'G-YOUR-TRACKING-ID', {
    //     page_path: location.pathname + location.search,
    //   });
    // }
    
    console.log(`[Analytics] Page View: ${location.pathname}`);
  }, [location]);

  return null;
}
