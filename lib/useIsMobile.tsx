import * as React from 'react';

const useIsMobile = (mobileScreenSize: number = 768): boolean => {
  if (typeof window.matchMedia !== 'function') {
    throw Error('matchMedia not supported by browser!');
  }

  const [isMobile, setIsMobile] = React.useState<boolean>(
    window.matchMedia(`(max-width: ${mobileScreenSize}px)`).matches
  );

  const checkIsMobile = React.useCallback((event: MediaQueryListEvent) => {
    setIsMobile(event.matches);
  }, []);

  React.useEffect(() => {
    const mediaListener = window.matchMedia(
      `(max-width: ${mobileScreenSize}px)`
    );

    try {
      mediaListener.addEventListener('change', checkIsMobile);
    } catch {
      mediaListener.addListener(checkIsMobile);
    }

    return () => {
      try {
        mediaListener.removeEventListener('change', checkIsMobile);
      } catch {
        mediaListener.removeListener(checkIsMobile);
      }
    };
  }, [mobileScreenSize, checkIsMobile]);

  return isMobile;
};

export default useIsMobile;
