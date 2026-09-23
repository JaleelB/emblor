'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue>({
  showToast: () => undefined,
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const nextId = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    nextId.current += 1;
    setToast({ id: nextId.current, message });

    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setToast(null);
      timeoutRef.current = null;
    }, 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="true">
        {toast && (
          <div className="toast-card" role="status" key={toast.id}>
            <span className="toast-dot" aria-hidden="true" />
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
