import { useRef, useCallback, useEffect } from 'react';

// Debounce hook for delaying execution
export function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

// Throttle hook for rate limiting
export function useThrottle(callback, limit) {
  const inThrottleRef = useRef(false);
  const lastArgsRef = useRef(null);

  const throttledCallback = useCallback((...args) => {
    if (!inThrottleRef.current) {
      callback(...args);
      inThrottleRef.current = true;

      setTimeout(() => {
        inThrottleRef.current = false;
        if (lastArgsRef.current) {
          callback(...lastArgsRef.current);
          lastArgsRef.current = null;
        }
      }, limit);
    } else {
      lastArgsRef.current = args;
    }
  }, [callback, limit]);

  return throttledCallback;
}

export default useDebounce;
