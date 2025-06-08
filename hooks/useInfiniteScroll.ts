import { useEffect, useRef, useState } from 'react';

export function useInfiniteScroll(callback: () => void) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerTarget = useRef(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          callback();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      }
    );

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [callback]);

  useEffect(() => {
    const currentTarget = observerTarget.current;
    const currentObserver = observerRef.current;

    if (currentTarget && currentObserver) {
      currentObserver.observe(currentTarget);
      return () => {
        if (currentTarget) {
          currentObserver.unobserve(currentTarget);
        }
      };
    }
  }, [observerTarget.current]);

  return { observerTarget, isIntersecting };
} 