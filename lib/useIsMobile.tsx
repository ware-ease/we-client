'use client';
import * as React from 'react';

const useIsMobile = (mobileScreenSize: number = 768): boolean => {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      console.error('matchMedia is not supported by the browser!');
      return;
    }

    const mediaListener = window.matchMedia(
      `(max-width: ${mobileScreenSize}px)`
    );
    setIsMobile(mediaListener.matches);

    const checkIsMobile = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    try {
      mediaListener.addEventListener('change', checkIsMobile);
    } catch {
      mediaListener.addListener(checkIsMobile); // For older browsers
    }

    return () => {
      try {
        mediaListener.removeEventListener('change', checkIsMobile);
      } catch {
        mediaListener.removeListener(checkIsMobile); // For older browsers
      }
    };
  }, [mobileScreenSize]);

  return isMobile;
};

export default useIsMobile;
