// Retrieve official economic observations through the application server.
import { fetchEconomicParams } from "./services/economic";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { 
  Child, 
  EconomicParams, 
  EvaluationInput, 
  VulnerabilityFactors, 
  JudicialLevel, 
  Adult, 
  DisabledMinor,
  DisabledAdult,
  DisabledPerson, 
  HousingType, 
  OccupancyStatus,
  TramiteCategory
} from "./types";
import { 
  DEFAULT_PARAMS, 
  evaluateLevelShift, 
  calculateCrianzaValue, 
  getChildEquivalentCoefficient, 
  getAdultEquivalentCoefficient,
  getBracketFromAge 
} from "./utils";
import EconomicParamsSettings from "./components/EconomicParamsSettings";
import CaseHistory from "./components/CaseHistory";
import { ShareAndInstallModal } from "./components/ShareAndInstallModal";
import { ServiceWorkerUpdateNotification } from "./components/ServiceWorkerUpdateNotification";
import { Scale, RotateCcw, Settings, Share2, Smartphone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

// Import modular form section components
import Section1Consultante from "./components/Section1Consultante";
import Section2GrupoFamiliar from "./components/Section2GrupoFamiliar";
import Section3Vivienda from "./components/Section3Vivienda";
import Section5SemaphoreSticky from "./components/Section5SemaphoreSticky";
import Section6PrintablePanel from "./components/Section6PrintablePanel";

const DRAFT_STORAGE_KEY = "semaforo_active_session_draft_v2";

export default function App() {
  // Helper to load draft on initialization
  const getInitialDraft = () => {
    if (typeof window === "undefined") return null;
    try {
      const saved = sessionStorage.getItem(DRAFT_STORAGE_KEY) || localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return null;
  };

  // Read browser storage once instead of parsing it on every keystroke.
  const [initialDraft] = useState(getInitialDraft);

  // Global economic params state
  // Discard legacy economic defaults unless they carry explicit provenance.
  const [params, setParams] = useState<EconomicParams>(initialDraft?.params?.provenance ? initialDraft.params : DEFAULT_PARAMS);

  // Start with an empty consultation rather than invented household and benefit amounts.
  const [adults, setAdults] = useState<Adult[]>(initialDraft?.adults || [{
    id: "adult-1", name: "", relationship: "Consultante / Titular", age: 0,
    sex: "Femenino", jobType: "Desocupado / Sin ingresos", monthlyIncome: 0
  }]);
  const [children, setChildren] = useState<Child[]>(initialDraft?.children || []);

  const [disabledMinors, setDisabledMinors] = useState<DisabledMinor[]>(initialDraft?.disabledMinors || []);
  const [disabledAdults, setDisabledAdults] = useState<DisabledAdult[]>(initialDraft?.disabledAdults || []);
  const [disabledPersons, setDisabledPersons] = useState<DisabledPerson[]>(initialDraft?.disabledPersons || []);
  
  const [housingType, setHousingType] = useState<HousingType>(initialDraft?.housingType || "Casa");
  const [occupancyStatus, setOccupancyStatus] = useState<OccupancyStatus>(initialDraft?.occupancyStatus || "Inquilino");
  // Missing household expenses must not be filled with demonstration amounts.
  const [montoAlquiler, setMontoAlquiler] = useState<number>(
    initialDraft?.montoAlquiler !== undefined
      ? initialDraft.montoAlquiler
      : 0
  );
  // Only actual medical expenses belong in the calculation.
  const [gastosSalud, setGastosSalud] = useState<number>(initialDraft?.gastosSalud ?? 0);
  
  // Vulnerability factors require an explicit entry for the consultation.
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityFactors>(initialDraft?.vulnerabilities || {
    violenciaGenero: false,
    discapacidad: false,
    hogarMonoparental: false,
    enfermedadTrabajoInformal: false
  });

  // Folder identification details state (Protected / Anonimized)
  const [nroCarpetaSimp, setNroCarpetaSimp] = useState<string>(initialDraft?.nroCarpetaSimp || "");
  const [fechaConsulta, setFechaConsulta] = useState<string>(initialDraft?.fechaConsulta || new Date().toISOString().split("T")[0]);

  // Tramite details according to Convenio
  const [tramiteTipo, setTramiteTipo] = useState<string>(initialDraft?.tramiteTipo || "gral_alimentos");
  const [tramiteCategoria, setTramiteCategoria] = useState<TramiteCategory>(initialDraft?.tramiteCategoria || "general");
  const [tramiteDetalle, setTramiteDetalle] = useState<string>(initialDraft?.tramiteDetalle || "");

  // Collapsible params panel toggle
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Expose real request progress and errors.
  const [isUpdatingParams, setIsUpdatingParams] = useState<boolean>(false);
  const [updateMessage, setUpdateMessage] = useState<string>("");

  // Persist draft to storage
  const saveDraftToStorage = useCallback(() => {
    try {
      const draft = {
        params,
        adults,
        children,
        disabledMinors,
        disabledAdults,
        disabledPersons,
        housingType,
        occupancyStatus,
        montoAlquiler,
        gastosSalud,
        vulnerabilities,
        nroCarpetaSimp,
        fechaConsulta,
        tramiteTipo,
        tramiteCategoria,
        tramiteDetalle
      };
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Storage quota or unavailable
    }
  }, [params, adults, children, disabledMinors, disabledAdults, disabledPersons, housingType, occupancyStatus, montoAlquiler, gastosSalud, vulnerabilities, nroCarpetaSimp, fechaConsulta, tramiteTipo, tramiteCategoria, tramiteDetalle]);

  // Auto-save draft on every change
  useEffect(() => {
    saveDraftToStorage();
  }, [saveDraftToStorage]);

  // Apply downloads atomically and retain existing values with an explicit error if retrieval fails.
  const handleUpdateParams = useCallback(async () => {
    setIsUpdatingParams(true);
    setUpdateMessage("");
    try {
      const official = await fetchEconomicParams();
      setParams(previous => ({ ...official, adultsCount: previous.adultsCount }));
      setUpdateMessage("Datos oficiales descargados. Consulte los períodos de referencia.");
    } catch (error) {
      setUpdateMessage(error instanceof Error ? error.message : "Error al consultar fuentes oficiales.");
    } finally { setIsUpdatingParams(false); }
  }, []);

  // Fetch on first use without overwriting a saved evaluation's historical parameters.
  useEffect(() => { if (!initialDraft?.params?.provenance) void handleUpdateParams(); }, [handleUpdateParams, initialDraft]);
  const handleResetParams = handleUpdateParams;

  // Handler to load a saved case
  const handleLoadCase = (historicalInput: EvaluationInput, historicalParams: EconomicParams) => {
    setGastosSalud(historicalInput.gastosSalud);
    // Older cases with no rent amount retain a zero deduction.
    setMontoAlquiler(historicalInput.montoAlquiler ?? 0);
    setChildren(historicalInput.children || []);
    setDisabledMinors(historicalInput.disabledMinors || []);
    setDisabledAdults(historicalInput.disabledAdults || []);
    setAdults(historicalInput.adults || [
      {
        id: "adult-1",
        name: "Titular SIMP",
        age: 35,
        sex: "Femenino",
        jobType: "Informal",
        educationLevel: "Secundario Completo",
        monthlyIncome: historicalInput.ingresoBruto
      }
    ]);
    setDisabledPersons(historicalInput.disabledPersons || []);
    setHousingType(historicalInput.housingType || "Casa");
    setOccupancyStatus(historicalInput.occupancyStatus || "Inquilino");
    setVulnerabilities(historicalInput.vulnerabilities);
    setParams(historicalParams);
    
    setNroCarpetaSimp(historicalInput.nroCarpetaSimp || "");
    setFechaConsulta(historicalInput.fechaConsulta || new Date().toISOString().split("T")[0]);
    setTramiteTipo(historicalInput.tramiteTipo || "gral_alimentos");
    setTramiteCategoria(historicalInput.tramiteCategoria || "general");
    setTramiteDetalle(historicalInput.tramiteDetalle || "");
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 2.a) Children Handlers
  const addChild = () => {
    const newChild: Child = {
      id: Math.random().toString(36).substring(2, 9),
      name: "",
      age: 8,
      ageBracket: "6to12",
      sex: "Femenino",
      percibeAUH: false,
      montoAUH: 0,
      percibeCuotaAlimentaria: false,
      montoCuotaAlimentaria: 0
    };
    setChildren([...children, newChild]);
  };

  const removeChild = (id: string) => {
    setChildren(children.filter((c) => c.id !== id));
  };

  const updateChild = (id: string, key: keyof Child, val: any) => {
    setChildren(
      children.map((c) => (c.id === id ? { ...c, [key]: val } : c))
    );
  };

  // 2.b) Disabled Minors Handlers
  const addDisabledMinor = () => {
    const newMinor: DisabledMinor = {
      id: Math.random().toString(36).substring(2, 9),
      name: "",
      age: 10,
      ageBracket: "6to12",
      sex: "Femenino",
      hasCUD: true,
      diagnosis: ""
    };
    setDisabledMinors([...disabledMinors, newMinor]);
    setVulnerabilities(prev => ({ ...prev, discapacidad: true }));
  };

  const removeDisabledMinor = (id: string) => {
    const updated = disabledMinors.filter((m) => m.id !== id);
    setDisabledMinors(updated);
    if (updated.length === 0 && disabledAdults.length === 0 && disabledPersons.length === 0) {
      setVulnerabilities(prev => ({ ...prev, discapacidad: false }));
    }
  };

  const updateDisabledMinor = (id: string, key: keyof DisabledMinor, val: any) => {
    setDisabledMinors(
      disabledMinors.map((m) => (m.id === id ? { ...m, [key]: val } : m))
    );
  };

  // 2.c) Other Adults (< 60) Handlers
  const addOtherAdult = () => {
    const newAdult: Adult = {
      id: Math.random().toString(36).substring(2, 9),
      name: "",
      relationship: "Cónyuge / Pareja",
      age: 36,
      sex: "Masculino",
      jobType: "Informal",
      educationLevel: "Secundario Completo",
      monthlyIncome: 0
    };
    setAdults([...adults, newAdult]);
  };

  const removeAdult = (id: string) => {
    if (adults.length <= 1) return; // Consultante must remain
    setAdults(adults.filter((a) => a.id !== id));
  };

  const updateAdult = (id: string, key: keyof Adult, val: any) => {
    setAdults(
      adults.map((a) => (a.id === id ? { ...a, [key]: val } : a))
    );
  };

  // 2.d) Disabled Adults Handlers
  const addDisabledAdult = () => {
    const newAdult: DisabledAdult = {
      id: Math.random().toString(36).substring(2, 9),
      name: "",
      relationship: "Familiar",
      age: 45,
      sex: "Femenino",
      hasCUD: true,
      diagnosis: "",
      monthlyIncome: 0
    };
    setDisabledAdults([...disabledAdults, newAdult]);
    setVulnerabilities(prev => ({ ...prev, discapacidad: true }));
  };

  const removeDisabledAdult = (id: string) => {
    const updated = disabledAdults.filter((a) => a.id !== id);
    setDisabledAdults(updated);
    if (updated.length === 0 && disabledMinors.length === 0 && disabledPersons.length === 0) {
      setVulnerabilities(prev => ({ ...prev, discapacidad: false }));
    }
  };

  const updateDisabledAdult = (id: string, key: keyof DisabledAdult, val: any) => {
    setDisabledAdults(
      disabledAdults.map((a) => (a.id === id ? { ...a, [key]: val } : a))
    );
  };

  // 2.e) Elderly Adults (>= 60) Handlers
  const addElderlyAdult = () => {
    const newElderly: Adult = {
      id: Math.random().toString(36).substring(2, 9),
      name: "",
      relationship: "Padre/Madre",
      age: 68,
      sex: "Femenino",
      jobType: "Jubilado / Pensionado",
      isPensioner: true,
      pensionType: "Jubilación ordinaria / mínima",
      educationLevel: "Primario Completo",
      // Pension amounts must reflect the actual household.
      monthlyIncome: 0
    };
    setAdults([...adults, newElderly]);
  };

  // Reset entire form
  const handleResetForm = () => {
    try {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {}
    setAdults([
      {
        id: "adult-1",
        name: "",
        relationship: "Consultante / Titular",
        age: 0,
        sex: "Femenino",
        jobType: "Informal",
        educationLevel: "Secundario Completo",
        monthlyIncome: 0
      }
    ]);
    setChildren([]);
    setDisabledMinors([]);
    setDisabledAdults([]);
    setDisabledPersons([]);
    setHousingType("Casa");
    setOccupancyStatus("Inquilino");
    setMontoAlquiler(0);
    setGastosSalud(0);
    setVulnerabilities({
      violenciaGenero: false,
      discapacidad: false,
      hogarMonoparental: false,
      enfermedadTrabajoInformal: false
    });
    setNroCarpetaSimp("");
    setFechaConsulta(new Date().toISOString().split("T")[0]);
    setTramiteTipo("gral_alimentos");
    setTramiteCategoria("general");
    setTramiteDetalle("");
  };

  // Calculate gross income across all members
  const adultsIncome = adults.reduce((sum, a) => sum + (a.monthlyIncome || 0), 0);
  const disabledAdultsIncome = disabledAdults.reduce((sum, da) => sum + (da.monthlyIncome || 0), 0);
  const totalGrossIncome = adultsIncome + disabledAdultsIncome;

  // Construct active evaluation input
  const input: EvaluationInput = {
    nroCarpetaSimp,
    fechaConsulta,
    ingresoBruto: totalGrossIncome,
    gastosSalud,
    montoAlquiler,
    adults,
    children,
    disabledPersons,
    disabledMinors,
    disabledAdults,
    housingType,
    occupancyStatus,
    vulnerabilities,
    tramiteTipo,
    tramiteCategoria,
    tramiteDetalle
  };

  // Block classification and printing when monetary references are unavailable or invalid.
  const paramsReady = [params.smvm, params.cba, params.cbt].every(value => Number.isFinite(value) && value > 0) && params.cbt >= params.cba;
  const result = evaluateLevelShift(input, params);


  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans antialiased" id="app-root">
      {/* 1. HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm" id="main-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Semáforo Admisión</h1>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest font-mono">Dpto. Judicial Necochea — Convenio Marco</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-right hidden sm:block">
            <p className="text-[9px] text-slate-400 uppercase font-black">Identificador de Consulta</p>
            <p className="font-mono text-sm text-slate-700 font-semibold">{nroCarpetaSimp || "Sin identificador"}</p>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm shadow-indigo-100 flex items-center gap-1.5 transition-all active:scale-95 border border-indigo-500"
              type="button"
              id="header-share-app-btn"
              title="Compartir enlace o instalar en celular Android"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartir / Instalar</span>
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                showSettings 
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200" 
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              type="button"
              id="header-settings-toggle"
            >
              <Settings className={`w-3.5 h-3.5 ${showSettings ? "animate-spin-slow text-indigo-600" : ""}`} />
              Parámetros
            </button>
            <button
              onClick={handleResetForm}
              className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
              type="button"
              id="header-new-case-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer Caso
            </button>
          </div>
        </div>
      </header>

      {/* COLLAPSIBLE ECONOMIC MANUAL PARAMETERS */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-100/50 border-b border-slate-200"
            id="collapsible-settings"
          >
            <div className="max-w-7xl mx-auto px-6 py-6">
              {/* Restore through the official request handler, retaining current values on failure. */}
              <EconomicParamsSettings onReset={handleResetParams} isUpdating={isUpdatingParams} params={params} onChange={next => setParams({ ...next, provenance: { mode: 'manual' } })} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN LAYOUT */}
      <main className="flex-1 p-4 sm:p-6 max-w-5xl w-full mx-auto space-y-6" id="main-content">
        {/* Keep source periods visible even when the evaluation is unavailable. */}
        <section className="bg-white border border-slate-200 rounded-xl p-4 space-y-2" aria-live="polite">
          <strong>Referencias económicas: {params.provenance?.mode === 'manual' ? 'ingreso manual' : 'datos oficiales'}</strong>
          <p>{updateMessage || (!paramsReady ? 'Sin valores disponibles para evaluar.' : 'Verifique los períodos antes de utilizar el resultado.')}</p>
          {Object.entries(params.provenance?.indicators || {} as NonNullable<EconomicParams['provenance']>['indicators']).map(([key, item]) => (
            <p key={key}><a className="text-indigo-700 underline" href={item.url} target="_blank" rel="noreferrer">{key.toUpperCase()} · {item.source}</a> · período {item.period} · ${item.value.toLocaleString('es-AR')}</p>
          ))}
          <p className="text-xs">CBA/CBT: referencia Gran Buenos Aires por adulto equivalente. No es una medición específica de Necochea.</p>
          <button className="text-indigo-700 underline" disabled={isUpdatingParams} onClick={handleUpdateParams}>{isUpdatingParams ? 'Consultando…' : 'Consultar fuentes oficiales'}</button>
        </section>

        {/* 1) Identificación de Carpeta e Ingresos del Titular */}
        <Section1Consultante
          consultante={adults[0]}
          nroCarpetaSimp={nroCarpetaSimp}
          tramiteTipo={tramiteTipo}
          tramiteCategoria={tramiteCategoria}
          tramiteDetalle={tramiteDetalle}
          onUpdateConsultanteField={(key, val) => updateAdult(adults[0].id, key, val)}
          onUpdateNroCarpetaSimp={setNroCarpetaSimp}
          onUpdateTramite={(tipoId, categoria, detalle) => {
            setTramiteTipo(tipoId);
            setTramiteCategoria(categoria);
            if (detalle !== undefined) setTramiteDetalle(detalle);
          }}
          onUpdateTramiteDetalle={setTramiteDetalle}
        />

        {/* 2) Composición del Grupo Familiar (a, b, c, d, e) */}
        <Section2GrupoFamiliar
          childrenList={children}
          onAddChild={addChild}
          onRemoveChild={removeChild}
          onUpdateChild={updateChild}
          disabledMinors={disabledMinors}
          onAddDisabledMinor={addDisabledMinor}
          onRemoveDisabledMinor={removeDisabledMinor}
          onUpdateDisabledMinor={updateDisabledMinor}
          otherAdults={adults.filter((a, idx) => idx > 0 && (a.age || 0) < 60)}
          onAddOtherAdult={addOtherAdult}
          onRemoveOtherAdult={removeAdult}
          onUpdateOtherAdult={updateAdult}
          disabledAdults={disabledAdults}
          onAddDisabledAdult={addDisabledAdult}
          onRemoveDisabledAdult={removeDisabledAdult}
          onUpdateDisabledAdult={updateDisabledAdult}
          elderlyAdults={adults.filter((a, idx) => idx > 0 && (a.age || 0) >= 60)}
          onAddElderlyAdult={addElderlyAdult}
          onRemoveElderlyAdult={removeAdult}
          onUpdateElderlyAdult={updateAdult}
          params={params}
        />

        {/* 3) Datos de Vivienda y Gastos Indispensables */}
        <Section3Vivienda
          housingType={housingType}
          occupancyStatus={occupancyStatus}
          montoAlquiler={montoAlquiler}
          gastosSalud={gastosSalud}
          onUpdateHousing={setHousingType}
          onUpdateOccupancy={setOccupancyStatus}
          onUpdateMontoAlquiler={setMontoAlquiler}
          onUpdateGastosSalud={setGastosSalud}
        />

        {/* Do not issue or save a classification using missing economic data. */}
        {paramsReady && <>
        {/* 4) Evaluación Semáforo de Admisión */}
        <Section5SemaphoreSticky
          input={input}
          result={result}
          params={params}
          isUpdatingParams={isUpdatingParams}
          updateMessage={updateMessage}
          onUpdateParams={handleUpdateParams}
          onResetParams={handleResetParams}
        />

        </>}
        {/* Require a recorded consultation before creating a report; keep saved history accessible. */}
        {paramsReady && adults[0]?.age > 0 && nroCarpetaSimp.trim() && <>
        {/* 5) Informe para Imprimir (Acta Oficial) */}
        <Section6PrintablePanel
          input={input}
          result={result}
          params={params}
          nroCarpetaSimp={nroCarpetaSimp}
          fechaConsulta={fechaConsulta}
          onUpdateFechaConsulta={setFechaConsulta}
        />

        </>}
        {/* Historial de Evaluaciones SIMP */}
        <div id="bento-cases-history" className="pt-2">
          <CaseHistory
            canSave={paramsReady && adults[0]?.age > 0 && Boolean(nroCarpetaSimp.trim())}
            activeInput={input}
            activeResult={result}
            activeParams={params}
            onLoadCase={handleLoadCase}
          />
        </div>
      </main>

      {/* NOTIFICACIÓN FLOTANTE DE ACTUALIZACIÓN SERVICE WORKER */}
      <ServiceWorkerUpdateNotification onBeforeReload={saveDraftToStorage} />

      {/* MODAL COMPARTIR E INSTALAR */}
      <ShareAndInstallModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
      />

      {/* FOOTER */}
      <footer className="px-6 py-4 text-[10px] text-slate-500 font-medium flex flex-col sm:flex-row justify-between items-center gap-3 bg-white border-t border-slate-200 mt-auto" id="main-footer">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-700">Sistema de Soporte de Decisiones Judiciales</span>
          <span>•</span>
          <span>Dpto. Judicial Necochea</span>
          <span>•</span>
          <button 
            onClick={() => setShowShareModal(true)}
            className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1"
          >
            <Smartphone className="w-3 h-3" />
            Instalar en Celular Android / Compartir
          </button>
        </div>
        <span className="uppercase font-bold tracking-tight text-slate-400">Doctrina de Amparo Alimentario 2026</span>
      </footer>
    </div>
  );
}
