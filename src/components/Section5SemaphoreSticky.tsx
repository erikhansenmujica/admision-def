/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { EvaluationInput, EvaluationResult, EconomicParams, JudicialLevel } from "../types";
import { Shield, RefreshCw, RotateCcw, Info, Check, CheckCircle, AlertCircle, AlertTriangle, Scale, DollarSign, Users, Heart, Activity, Home } from "lucide-react";
import { formatCurrency } from "../utils";

interface Props {
  input: EvaluationInput;
  result: EvaluationResult;
  params: EconomicParams;
  isUpdatingParams: boolean;
  updateMessage: string;
  onUpdateParams: () => void;
  onResetParams: () => void;
}

export default function Section5SemaphoreSticky({
  input,
  result,
  params,
  isUpdatingParams,
  updateMessage,
  onUpdateParams,
  onResetParams
}: Props) {
  // Check if evaluation data is empty / uncompleted (e.g. after clicking reset)
  const isTitularEmpty =
    !input.adults ||
    input.adults.length === 0 ||
    ((!input.adults[0].name || input.adults[0].name.trim() === "") &&
      (input.adults[0].age === 0 || !input.adults[0].age) &&
      (input.adults[0].monthlyIncome === 0 || !input.adults[0].monthlyIncome));

  const hasAnyData =
    Boolean(input.nroCarpetaSimp && input.nroCarpetaSimp.trim() !== "") ||
    !isTitularEmpty ||
    input.ingresoBruto > 0 ||
    input.gastosSalud > 0 ||
    Boolean(input.occupancyStatus === "Inquilino" && input.montoAlquiler && input.montoAlquiler > 0) ||
    (input.children && input.children.length > 0) ||
    (input.disabledPersons && input.disabledPersons.length > 0) ||
    (input.adults && input.adults.length > 1) ||
    input.vulnerabilities.violenciaGenero ||
    input.vulnerabilities.discapacidad ||
    input.vulnerabilities.hogarMonoparental ||
    input.vulnerabilities.enfermedadTrabajoInformal;

  const isFormEmpty = !hasAnyData;

  const getSemáforoTheme = (level: JudicialLevel) => {
    switch (level) {
      case JudicialLevel.VERDE:
        return {
          bg: "bg-emerald-50 border-emerald-200",
          ring: "ring-emerald-100",
          glowingLight: "bg-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.8)] animate-pulse",
          text: "text-emerald-700",
          label: "VERDE",
          desc: "Admisible - Defensoría Oficial Gratuita",
          pillBg: "bg-emerald-100 text-emerald-800"
        };
      case JudicialLevel.AMARILLO:
        return {
          bg: "bg-amber-50 border-amber-200",
          ring: "ring-amber-100",
          glowingLight: "bg-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.8)] animate-pulse",
          text: "text-amber-700",
          label: "AMARILLO",
          desc: "Evaluación Excepcional / Listado Intermedio",
          pillBg: "bg-amber-100 text-amber-800"
        };
      case JudicialLevel.ROJO:
        return {
          bg: "bg-rose-50 border-rose-200",
          ring: "ring-rose-100",
          glowingLight: "bg-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.8)] animate-pulse",
          text: "text-rose-700",
          label: "ROJO",
          desc: "Derivación Particular / Colegio de Abogados",
          pillBg: "bg-rose-100 text-rose-800"
        };
    }
  };

  const semTheme = getSemáforoTheme(result.finalLevel);

  return (
    <div className="space-y-5" id="section-4-semaphore">
      {/* 4) Evaluación Semáforo according to regulations */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">4) Evaluación y Dictamen Semáforo de Admisión</h3>
              <p className="text-xs text-slate-500">Dictamen de admisibilidad formal en tiempo real según normativa PBA y Convenio Necochea</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Criterio: {isFormEmpty ? "Sin datos cargados" : result.isShifted ? "Ponderación Excepcional IVS" : "Estándar Monetario"}
            </span>
          </div>
        </div>

        {isFormEmpty ? (
          /* Estado Vacío cuando se presionó restablecer */
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-24 h-24 bg-slate-100 border-4 border-slate-200 rounded-full flex items-center justify-center mb-4">
              <div className="flex gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-slate-300"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-slate-300"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-slate-300"></span>
              </div>
            </div>
            <h4 className="text-lg font-bold text-slate-700 mb-1">
              Esperando ingreso de datos
            </h4>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Complete los datos del Titular (Paso 1) y la composición del grupo familiar (Paso 2) para emitir el dictamen y calcular los indicadores económicos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Semáforo Bulb and Resolution */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-50/70 p-6 rounded-2xl border border-slate-100">
              {/* Tramite badge */}
              <div className="mb-3 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/70 px-2.5 py-1 rounded-full inline-block mb-1">
                  Trámite: {result.tramiteNombre}
                </span>
                {result.isMateriaReservada && (
                  <span className="text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full block mb-1">
                    🛡️ Materia Reservada Exclusiva e Indelegable
                  </span>
                )}
                {result.isAmparoProfe && (
                  <span className="text-[9px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full block mb-1">
                    🏥 Amparo de Salud PROFE / PNC
                  </span>
                )}
                {result.isDanosPerjuiciosPenal && (
                  <span className="text-[9px] font-bold text-stone-700 bg-stone-100 border border-stone-300 px-2 py-0.5 rounded-full block mb-1">
                    ⚖️ Daños Penal / Personas Privadas de Libertad
                  </span>
                )}
                {result.isRangoAmpliado && (
                  <span className="text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full block mb-1">
                    🧠 Rango Ampliado (3 a 4 SMVM)
                  </span>
                )}
                {result.isTopeDivorcio && (
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full block mb-1">
                    💔 Situación Especial Divorcio (Tope 1.5 a 2 SMVM)
                  </span>
                )}
                {result.isTopeSucesion && (
                  <span className="text-[9px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full block mb-1">
                    📜 Situación Especial Sucesión (Tope 1.5 SMVM)
                  </span>
                )}
              </div>

              {/* Big Glowing Light Bulb */}
              <div className={`w-28 h-28 ${semTheme.bg} rounded-full flex items-center justify-center mb-4 ring-8 ${semTheme.ring} transition-all duration-500`}>
                <div className={`w-20 h-20 rounded-full ${semTheme.glowingLight} transition-all duration-500`} />
              </div>

              <h4 className={`text-3xl font-black tracking-tight ${semTheme.text} mb-1 text-center`}>
                {semTheme.label}
              </h4>
              <p className="text-slate-600 font-semibold text-xs px-2 text-center leading-relaxed">
                {semTheme.desc}
              </p>

              {/* Legal Justification message */}
              <div className="mt-5 w-full p-4 bg-indigo-600 rounded-2xl text-white text-xs leading-relaxed shadow-xs">
                <p className="font-bold flex items-center gap-1.5 text-[11px] mb-1 text-indigo-100">
                  <Shield className="w-3.5 h-3.5 text-indigo-200" />
                  Resolución y Fundamento
                </p>
                <p className="text-indigo-50 text-[11px] leading-relaxed">
                  {result.reclassificationReason}
                </p>
              </div>
            </div>

            {/* Right Column: Breakdown Metrics & Vulnerabilities */}
            <div className="lg:col-span-7 space-y-5">
              {/* Economic breakdown metrics */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3 text-xs">
                <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Desglose de Factores Económicos</h5>

                <div className="space-y-2">
                  {/* Total Income */}
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                    <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      Ingreso Familiar Total
                    </span>
                    <span className="font-bold text-slate-800 font-mono">
                      {formatCurrency(input.ingresoBruto)}
                    </span>
                  </div>

                  {/* Adult equivalents */}
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                    <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Adultos Equivalentes (INDEC)
                    </span>
                    <span className="font-bold text-slate-700 font-mono">
                      {result.adeqTotal.toFixed(2)} ad. eq.
                    </span>
                  </div>

                  {/* CBT total */}
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                    <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                      <Heart className="w-3.5 h-3.5 text-slate-400" />
                      Canasta Básica Total (CBT Hogar)
                    </span>
                    <span className="font-bold text-rose-500 font-mono">
                      -{formatCurrency(result.cbtTotal)}
                    </span>
                  </div>

                  {/* Health expenses */}
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                    <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                      Gastos Médicos Crónicos
                    </span>
                    <span className="font-bold text-rose-500 font-mono">
                      -{formatCurrency(input.gastosSalud)}
                    </span>
                  </div>

                  {/* Rent expenses (if tenant) */}
                  {input.occupancyStatus === "Inquilino" && (input.montoAlquiler ?? 0) > 0 && (
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-2 bg-amber-50/50 px-2 py-1 rounded-lg">
                      <span className="text-amber-800 flex items-center gap-1.5 font-medium text-xs">
                        <Home className="w-3.5 h-3.5 text-amber-600" />
                        Alquiler / Canon Locativo
                      </span>
                      <span className="font-bold text-rose-600 font-mono text-xs">
                        -{formatCurrency(input.montoAlquiler || 0)}
                      </span>
                    </div>
                  )}

                  {/* INA Result */}
                  <div className="flex justify-between items-center pt-2 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
                    <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-indigo-600" />
                      Ingreso Neto Ajustado (INA)
                    </span>
                    <span className="text-base font-black text-indigo-700 font-mono">
                      {formatCurrency(result.ina)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vulnerability factors list */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Índice IVS Otorgado</span>
                  <span className="font-bold font-mono text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full text-xs border border-indigo-200/50">
                    {result.ivsScore} / 8 Puntos
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-slate-500">
                  <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                    input.vulnerabilities.violenciaGenero ? "bg-indigo-50 border-indigo-200 text-indigo-800 font-semibold" : "bg-white border-slate-200"
                  }`}>
                    <Check className={`w-3.5 h-3.5 ${input.vulnerabilities.violenciaGenero ? "text-indigo-600" : "text-slate-300"}`} />
                    Género / Familiar
                  </div>
                  <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                    input.vulnerabilities.discapacidad ? "bg-indigo-50 border-indigo-200 text-indigo-800 font-semibold" : "bg-white border-slate-200"
                  }`}>
                    <Check className={`w-3.5 h-3.5 ${input.vulnerabilities.discapacidad ? "text-indigo-600" : "text-slate-300"}`} />
                    Discapacidad
                  </div>
                  <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                    input.vulnerabilities.hogarMonoparental ? "bg-indigo-50 border-indigo-200 text-indigo-800 font-semibold" : "bg-white border-slate-200"
                  }`}>
                    <Check className={`w-3.5 h-3.5 ${input.vulnerabilities.hogarMonoparental ? "text-indigo-600" : "text-slate-300"}`} />
                    Hogar Monoparental
                  </div>
                  <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                    input.vulnerabilities.enfermedadTrabajoInformal ? "bg-indigo-50 border-indigo-200 text-indigo-800 font-semibold" : "bg-white border-slate-200"
                  }`}>
                    <Check className={`w-3.5 h-3.5 ${input.vulnerabilities.enfermedadTrabajoInformal ? "text-indigo-600" : "text-slate-300"}`} />
                    Informalidad / Salud
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actualizar INDEC & SMVM Button card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Parámetros Macroeconómicos Base</span>
            <span className="font-mono text-[11px] text-slate-600 font-semibold block mt-0.5">
              SMVM: {formatCurrency(params.smvm)} | CBT: {formatCurrency(params.cbt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onUpdateParams}
              disabled={isUpdatingParams}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isUpdatingParams
                  ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs"
              }`}
              title="Consultar últimas observaciones publicadas en Datos Argentina"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isUpdatingParams ? "animate-spin" : ""}`} />
              Actualizar
            </button>
            <button
              type="button"
              onClick={onResetParams}
              disabled={isUpdatingParams}
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs transition-all"
              title="Volver a consultar las fuentes oficiales"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Reiniciar
            </button>
          </div>
        </div>

        {/* Dynamic update feedback message */}
        {updateMessage && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl px-3 py-2 text-[10px] font-semibold leading-relaxed animate-fade-in">
            {updateMessage}
          </div>
        )}
      </div>
    </div>
  );
}
