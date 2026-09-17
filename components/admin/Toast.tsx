"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (toast: ToastItem) => void;
const listeners = new Set<ToastListener>();

export const toast = {
  show(message: string, type: ToastType = "info", duration = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const item: ToastItem = { id, message, type, duration };
    listeners.forEach((listener) => listener(item));
    return id;
  },
  success(message: string, duration = 4000) {
    return this.show(message, "success", duration);
  },
  error(message: string, duration = 4000) {
    return this.show(message, "error", duration);
  },
  warning(message: string, duration = 4000) {
    return this.show(message, "warning", duration);
  },
  info(message: string, duration = 4000) {
    return this.show(message, "info", duration);
  },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleNewToast = (newToast: ToastItem) => {
      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration !== Infinity) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, newToast.duration || 4000);
      }
    };

    listeners.add(handleNewToast);
    return () => {
      listeners.delete(handleNewToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((t) => {
          const config = {
            success: {
              icon: CheckCircle2,
              bg: "bg-white border-l-4 border-emerald-500 text-emerald-900 shadow-xl",
              iconColor: "text-emerald-600",
            },
            error: {
              icon: AlertCircle,
              bg: "bg-white border-l-4 border-rose-500 text-rose-900 shadow-xl",
              iconColor: "text-rose-600",
            },
            warning: {
              icon: AlertTriangle,
              bg: "bg-white border-l-4 border-amber-500 text-amber-900 shadow-xl",
              iconColor: "text-amber-600",
            },
            info: {
              icon: Info,
              bg: "bg-white border-l-4 border-teal-500 text-teal-900 shadow-xl",
              iconColor: "text-teal-600",
            },
          }[t.type];

          const IconComponent = config.icon;

          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 shadow-lg ${config.bg}`}
            >
              <IconComponent className={`w-4 h-4 shrink-0 ${config.iconColor} mt-0.5`} />
              <div className="flex-1 text-xs font-semibold text-gray-800 leading-relaxed">
                {t.message}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-gray-400 hover:text-gray-700 p-0.5 rounded transition-colors shrink-0 cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
