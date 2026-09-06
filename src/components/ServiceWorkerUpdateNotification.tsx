import React, { useState, useEffect } from "react";
import { RefreshCw, Sparkles, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  onBeforeReload?: () => void;
}

export function ServiceWorkerUpdateNotification({ onBeforeReload }: Props) {
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    // Handler when an updated Service Worker is ready
    const handleUpdateAvailable = (event: Event) => {
      const customEvent = event as CustomEvent<{ newWorker?: ServiceWorker }>;
      if (customEvent.detail?.newWorker) {
        setWaitingWorker(customEvent.detail.newWorker);
      }
      setShowUpdate(true);
    };

    // Handler when controller changed
    const handleControllerChange = () => {
      setShowUpdate(true);
    };

    window.addEventListener("sw-update-available", handleUpdateAvailable);
    window.addEventListener("sw-controller-change", handleControllerChange);

    return () => {
      window.removeEventListener("sw-update-available", handleUpdateAvailable);
      window.removeEventListener("sw-controller-change", handleControllerChange);
    };
  }, []);

  const handleApplyUpdate = () => {
    setIsUpdating(true);
    
    // Save any pending session state before reload
    if (onBeforeReload) {
      try {
        onBeforeReload();
      } catch (err) {
        console.warn("Error saving session state before reload:", err);
      }
    }

    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }

    // Give service worker a brief moment to activate, then reload seamlessly
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <AnimatePresence>
      {showUpdate && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
        >
          <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-indigo-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center border border-indigo-400/30 shrink-0 mt-0.5 sm:mt-0">
                <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">Nueva Versión Disponible</h4>
                  <span className="text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded">
                    Sin pérdida de datos
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Hay mejoras del sistema disponibles. Al actualizar se conservarán todos tus expedientes y datos de la sesión.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
              <button
                onClick={handleApplyUpdate}
                disabled={isUpdating}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 flex-1 sm:flex-initial cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? "animate-spin" : ""}`} />
                <span>{isUpdating ? "Actualizando..." : "Actualizar"}</span>
              </button>
              <button
                onClick={() => setShowUpdate(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                title="Descartar por ahora"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
