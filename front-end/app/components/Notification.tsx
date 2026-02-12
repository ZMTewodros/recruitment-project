
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type NotifyFn = (message: string) => void;

const NotificationsContext = createContext<{
  showSuccess: NotifyFn;
  showError: NotifyFn;
} | null>(null);

let idCounter = 0;

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Array<{ id: number; type: "success" | "error"; message: string }>>([]);

  const remove = useCallback((id: number) => {
    setItems((s) => s.filter((i) => i.id !== id));
  }, []);

  const show = useCallback((type: "success" | "error", message: string) => {
    const id = ++idCounter;
    setItems((s) => [...s, { id, type, message }]);
    setTimeout(() => remove(id), 3000);
  }, [remove]);

  const showSuccess: NotifyFn = useCallback((m: string) => show("success", m), [show]);
  const showError: NotifyFn = useCallback((m: string) => show("error", m), [show]);

  return (
    <NotificationsContext.Provider value={{ showSuccess, showError }}>
      {children}

      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        {items.map((it) => (
          <div
            key={it.id}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white ${
              it.type === "success" ? "bg-green-600" : "bg-red-600"
            } animate-slide-in`}
          >
            <span className="text-lg">{it.type === "success" ? "✅" : "❌"}</span>
            <p className="font-medium">{it.message}</p>
          </div>
        ))}
      </div>
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}

export default NotificationsProvider;

