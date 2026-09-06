import React, { useState, useEffect } from "react";
import { 
  Share2, 
  Smartphone, 
  QrCode, 
  Copy, 
  Check, 
  Lock, 
  Sparkles, 
  X, 
  DollarSign, 
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Radio,
  DownloadCloud
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareAndInstallModal({ isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  // Share only the actual application address.
  const [shareUrl, setShareUrl] = useState(window.location.origin + window.location.pathname);
  const [activeTab, setActiveTab] = useState<"link" | "android" | "qr" | "deploy" | "privacy">("link");
  const [isDevUrl, setIsDevUrl] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const current = window.location.href;
      const isDev = current.includes("ais-dev-");
      setIsDevUrl(isDev);

      // Do not manufacture a deployment URL from a development hostname.
      setShareUrl(window.location.origin + window.location.pathname);

      // Listen for PWA install prompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setDeferredPrompt(null);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Semáforo Admisión Judicial — Necochea",
          text: "Evaluador de admisibilidad para el Beneficio de Litigar sin Gastos (Dpto. Judicial Necochea).",
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  if (!isOpen) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    shareUrl
  )}&bgcolor=ffffff&color=1e1b4b&margin=1`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 backdrop-blur-md flex items-center justify-center border border-indigo-400/30 shrink-0">
                <Share2 className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold">Compartir e Instalar en Android</h3>
                  <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" /> PWA Oficial
                  </span>
                </div>
                <p className="text-xs text-indigo-200">
                  Acceso libre, costo $0 permanente y privacidad estricta por usuario
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Diagnostic alert when running in internal container preview */}
          {isDevUrl && (
            <div className="bg-amber-50 border-b border-amber-200/80 px-5 py-2.5 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="font-semibold text-amber-950">Atención técnica:</strong> Estás en el contenedor de edición interno (<code>ais-dev-</code>). Para que el enlace abra en celulares de terceros, debes habilitar <strong>«Share»</strong> en la barra superior de Google AI Studio o usar el enlace público <code>ais-pre-</code>.
              </div>
            </div>
          )}

          {/* Quick Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/90 px-4 sm:px-6 pt-2.5 gap-1 sm:gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("link")}
              className={`pb-2.5 px-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-all ${
                activeTab === "link"
                  ? "border-indigo-600 text-indigo-700 bg-white rounded-t-lg"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Enlace y QR
            </button>
            <button
              onClick={() => setActiveTab("android")}
              className={`pb-2.5 px-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-all ${
                activeTab === "android"
                  ? "border-indigo-600 text-indigo-700 bg-white rounded-t-lg"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Paso a Paso Android
            </button>
            <button
              onClick={() => setActiveTab("deploy")}
              className={`pb-2.5 px-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-all ${
                activeTab === "deploy"
                  ? "border-indigo-600 text-indigo-700 bg-white rounded-t-lg"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              Solución Definitiva (1-Clic)
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`pb-2.5 px-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-all ${
                activeTab === "privacy"
                  ? "border-indigo-600 text-indigo-700 bg-white rounded-t-lg"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Privacidad
            </button>
          </div>

          {/* Body content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            
            {/* TAB: LINK & QR */}
            {activeTab === "link" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* 1-Click PWA Install button if browser triggers prompt */}
                {deferredPrompt && !isInstalled && (
                  <div className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl text-white shadow-md flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-indigo-200">Detección Automática Android</h4>
                      <p className="text-xs font-medium text-indigo-100">Instala el Semáforo en tu pantalla de inicio en 1 toque.</p>
                    </div>
                    <button
                      onClick={handleInstallClick}
                      className="px-3.5 py-2 bg-white text-indigo-700 font-bold rounded-xl text-xs shadow-xs hover:bg-indigo-50 transition-colors shrink-0"
                    >
                      Instalar App
                    </button>
                  </div>
                )}

                {/* Direct Link Share Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Enlace Oficial para Celular y Colegas
                    </label>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      Acceso Público Directo
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 truncate select-all">
                      {shareUrl}
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
                        copied
                          ? "bg-emerald-600 text-white"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "¡Copiado!" : "Copiar"}</span>
                    </button>
                    <a
                      href={shareUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors flex items-center justify-center"
                      title="Abrir en una nueva pestaña"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                  <div className="p-2 bg-white rounded-2xl border-2 border-indigo-200 shadow-xs shrink-0">
                    <img
                      src={qrCodeUrl}
                      alt="Código QR para Android"
                      className="w-36 h-36 rounded-xl object-contain"
                    />
                  </div>
                  <div className="space-y-1.5 text-center sm:text-left">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
                      <QrCode className="w-4 h-4 text-indigo-600" />
                      Escanear con Celular Android
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Abre la cámara de cualquier teléfono, apunta a la pantalla y toca el enlace para abrir la aplicación al instante.
                    </p>
                    <div className="pt-1">
                      <button
                        onClick={handleNativeShare}
                        className="text-xs text-indigo-600 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Share2 className="w-3 h-3" />
                        Enviar enlace por WhatsApp / Redes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: STEP BY STEP ANDROID */}
            {activeTab === "android" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-2xl">
                  <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-2 mb-1">
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    Instalación sin Google Play (Formato PWA Nativo)
                  </h4>
                  <p className="text-[11px] text-indigo-800 leading-relaxed">
                    La aplicación cumple con el estándar W3C Progressive Web App. Se instala directamente en Android ocupando menos de <strong>1 MB</strong> y funcionando a máxima velocidad.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Abrir el enlace en Google Chrome</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Envía el enlace público a tu celular y ábrelo con Chrome.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Tocar los tres puntos (⋮) de opciones</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Ubicados en la esquina superior derecha de Google Chrome.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Seleccionar «Instalar aplicación» (o «Agregar a pantalla principal»)
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Aparecerá el ícono oficial del <strong>Semáforo Judicial</strong> en tu menú de apps de Android, abriéndose en pantalla completa como una app nativa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DEPLOY OPTIONS */}
            {activeTab === "deploy" && (
              <div className="space-y-4 animate-in fade-in duration-200 text-xs">
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    ¿Por qué algunos enlaces no abren en otros celulares?
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Google AI Studio mantiene las instancias de desarrollo privadas por seguridad. Para que el enlace sea 100% público a nivel mundial y no dependa de tu sesión, dispones de 2 métodos infalibles:
                  </p>
                </div>

                {/* Option 1: Share in AI Studio */}
                <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-indigo-950 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">A</span>
                      Habilitar en Google AI Studio (En 1 Clic)
                    </h4>
                    <span className="bg-indigo-200/60 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md">Instantáneo</span>
                  </div>
                  <p className="text-[11px] text-indigo-900 leading-relaxed">
                    En la barra superior de esta pantalla de Google AI Studio, haz clic en el botón <strong>«Share» (Compartir)</strong> o en el menú de opciones (⋮) y selecciona <strong>«Publish / Share Link»</strong>. Esto activa inmediatamente el acceso público para todos los celulares.
                  </p>
                </div>

                {/* Option 2: Deploy to Vercel/Netlify for permanent custom domain */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-emerald-950 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">B</span>
                      Publicación Gratuita e Ilimitada en Vercel / Netlify
                    </h4>
                    <span className="bg-emerald-200/60 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">100% Permanente</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    En el menú de AI Studio haz clic en <strong>Export to GitHub</strong> o <strong>Export to ZIP</strong>. Puedes arrastrar los archivos a Vercel o Netlify en 10 segundos para tener tu propio enlace (ej: <code>semaforo-necochea.vercel.app</code>) activo los 365 días del año sin costos.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: PRIVACY */}
            {activeTab === "privacy" && (
              <div className="space-y-3.5 animate-in fade-in duration-200 text-xs">
                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold mb-1">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    Aislamiento y Privacidad Total entre Operadores
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Toda la información y evaluaciones de carpetas SIMP que carga un operador se almacenan <strong>exclusivamente en la memoria local de su propio dispositivo</strong> (almacenamiento cifrado en el navegador). Ningún otro usuario puede ver ni acceder a sus casos.
                  </p>
                </div>

                <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-2xl">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold mb-1">
                    <RefreshCw className="w-4 h-4 text-indigo-600" />
                    Actualizaciones Automáticas Centralizadas
                  </div>
                  <p className="text-[11px] text-indigo-800 leading-relaxed">
                    Cada vez que apliques mejoras, ajustes normativos o valores del INDEC, todos los usuarios reciben los cambios en tiempo real al abrir la app o recargar la página.
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl">
                  <div className="flex items-center gap-2 text-amber-900 font-bold mb-1">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    Costo $0.00 Permanente
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Sin tarifas de publicación de Google Play ($25 USD), sin servidores de bases de datos pagas ni costos de suscripción mensual.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-[11px]">Diseñado para el Departamento Judicial de Necochea</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

