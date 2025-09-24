'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const startProgress = () => {
    setVisible(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.random() * 15));
    }, 200);

    const completeTimeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setVisible(false), 300);
      setTimeout(() => setProgress(0), 600);
    }, 1200);

    return () => {
      clearInterval(interval);
      clearTimeout(completeTimeout);
    };
  };

  useEffect(() => {
    // Trigger on pathname change
    const cleanup = startProgress();
    return cleanup;
  }, [pathname]);

  useEffect(() => {
    // Trigger on clicks on links or buttons
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) {
        startProgress();
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '4px',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: `${Math.min(progress, 100)}%`,
          height: '100%',
          background: '#2563eb',
          boxShadow: '0 0 10px rgba(37, 99, 235, 0.4)',
          transition: 'width 200ms ease-out',
        }}
      />
    </div>
  );
}
