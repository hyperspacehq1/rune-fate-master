import { useState, useEffect } from "react";

/**
 * Detects if the user is on an iOS device
 * @returns boolean indicating if device is iOS
 */
export function useIsIOS(): boolean {
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera; // eslint-disable-line
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    setIsIOS(isIOSDevice);
  }, []);

  return isIOS;
}

/**
 * Detects if the user is on a mobile device (iOS or Android)
 * @returns boolean indicating if device is mobile
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera; // eslint-disable-line
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    setIsMobile(isMobileDevice);
  }, []);

  return isMobile;
}

/**
 * Returns detailed device information
 */
export function useDeviceInfo() {
  const isIOS = useIsIOS();
  const isMobile = useIsMobile();

  return {
    isIOS,
    isMobile,
    isDesktop: !isMobile,
  };
}
