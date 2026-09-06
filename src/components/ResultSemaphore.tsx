/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { EvaluationResult, JudicialLevel, EconomicParams } from "../types";
import { formatCurrency } from "../utils";
import { Info, AlertTriangle, CheckCircle, AlertCircle, ArrowUpRight, Scale, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  result: EvaluationResult;
  params: EconomicParams;
  ingresoBruto: number;
  gastosSalud: number;
}

export default function ResultSemaphore({ result, params, ingresoBruto, gastosSalud }: Props) {
  const [isCalculationsOpen, setIsCalculationsOpen] = useState(true);

  const getLevelConfig = (level: JudicialLevel) => {
    switch (level) {
      case JudicialLevel.VERDE:
        return {
          title: "NIVEL VERDE 🟢 - Defensoría Oficial",
          subTitle: "Cumple las pautas para admisión directa y patrocinio oficial.",
          colorClass: "bg-emerald-50 border-emerald-500 text-emerald-950",
          badgeColor: "bg-emerald-500 text-white",
          lightColor: "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.7)]",
          icon: CheckCircle,
          dest: "Derivación automática a la Defensoría Oficial de Pobres y Ausentes (Convenio Necochea, Cláusula Tercera)."
        };
      case JudicialLevel.AMARILLO:
        return {
          title: "NIVEL AMARILLO 🟡 - Evaluación Excepcional",
          subTitle: "Situación intermedia. Requiere análisis circunstanciado del Defensor Oficial.",
          colorClass: "bg-amber-50 border-amber-500 text-amber-950",
          badgeColor: "bg-amber-500 text-white",
          lightColor: "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.7)]",
          icon: AlertTriangle,
          dest: "Derivación al Listado Específico Intermedio con honorarios diferidos, financiados o ponderados judicialmente."
        };
      case JudicialLevel.ROJO:
        return {
          title: "NIVEL ROJO 🔴 - Colegio de Abogados",
          subTitle: "Supera los umbrales económicos habituales de vulnerabilidad.",
          colorClass: "bg-rose-50 border-rose-500 text-rose-950",
          badgeColor: "bg-rose-500 text-white",
          lightColor: "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.7)]",
          icon: AlertCircle,
          dest: "Se deriva al Consultorio Jurídico Gratuito del Colegio de Abogados o patrocinio particular por ausencia de extrema vulnerabilidad."
        };
    }
  };

  const levelConf = getLevelConfig(result.finalLevel);
  const LevelIcon = levelConf.icon;

  return (
    <div className="space-y-6" id="result-semaphore-container">
      {/* GLOWING TRAFFIC LIGHT BANNER */}
      <div className={`border-l-4 rounded-r-xl p-5 ${levelConf.colorClass} shadow-sm transition-all duration-300 relative overflow-hidden`} id="main-result-banner">
        {/* Decorative background circle */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-44 h-44 rounded-full bg-slate-500/5 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            {/* Visual Semáforo Light Bulb */}
            <div className="bg-slate-900 p-2.5 rounded-xl flex flex-col gap-1.5 shadow-md border border-slate-700/50 shrink-0">
              <div className={`w-4.5 h-4.5 rounded-full transition-all duration-500 ${result.finalLevel === JudicialLevel.ROJO ? "bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "bg-rose-950/70"}`} />
              <div className={`w-4.5 h-4.5 rounded-full transition-all duration-500 ${result.finalLevel === JudicialLevel.AMARILLO ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" : "bg-amber-950/70"}`} />
              <div className={`w-4.5 h-4.5 rounded-full transition-all duration-500 ${result.finalLevel === JudicialLevel.VERDE ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" : "bg-emerald-950/70"}`} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${levelConf.badgeColor}`}>
                  {result.finalLevel}
                </span>
                {result.isShifted && (
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                    <Scale className="w-3 h-3 animate-bounce" /> Salto de Nivel Aplicado
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">{levelConf.title}</h2>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{levelConf.subTitle}</p>
            </div>
          </div>

          <div className="shrink-0 text-right sm:border-l sm:border-slate-300/40 sm:pl-4">
            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Ingreso Neto Ajustado</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight" id="calculated-ina-display">
              {formatCurrency(result.ina)}
            </span>
          </div>
        </div>

        {/* Detailed Reason Banner */}
        <div className="mt-4 pt-4 border-t border-slate-300/30 text-xs">
          <div className="flex items-start gap-2 text-slate-800">
            <Info className="w-4.5 h-4.5 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Fundamento Técnico:</p>
              <p className="text-[11px] text-slate-700 leading-relaxed mt-0.5 italic">{result.reclassificationReason}</p>
            </div>
          </div>
        </div>

        {/* Destino Recomendado */}
        <div className="mt-3 bg-white/60 rounded-lg p-2.5 border border-slate-200/40 text-[11px]">
          <strong className="text-slate-800">Destino del expediente:</strong> <span className="text-slate-700">{levelConf.dest}</span>
        </div>
      </div>

      {/* DETAILED COMPUTATIONS ACCORDION */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setIsCalculationsOpen(!isCalculationsOpen)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          id="toggle-calculations-btn"
        >
          <span className="flex items-center gap-1.5"><Scale className="w-4 h-4 text-slate-500" /> Desglose de Cálculo y Límites</span>
          {isCalculationsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isCalculationsOpen && (
          <div className="p-4 space-y-4" id="calculations-breakdown">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none mb-1">Ingreso Bruto Familiar</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{formatCurrency(ingresoBruto)}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none mb-1">Canasta Básica Total (CBT)</span>
                <span className="text-sm font-bold text-indigo-700 font-mono">-{formatCurrency(result.cbtTotal)}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none mb-1">Gastos Salud Crónicos</span>
                <span className="text-sm font-bold text-rose-700 font-mono">-{formatCurrency(gastosSalud)}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <div className="text-xs">
                <span className="font-semibold text-slate-800">Resultado: Ingreso Neto Ajustado (INA)</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Fórmula: Ingreso Bruto - CBT_Hogar - Gastos de Salud</p>
              </div>
              <span className="text-base font-extrabold text-slate-900 font-mono">
                {formatCurrency(result.ina)}
              </span>
            </div>

            {/* Scale Comparison */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700">
                  Límites de Referencia SMVM ({formatCurrency(params.smvm)})
                </h4>
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {result.tramiteNombre}
                </span>
              </div>

              {result.isMateriaReservada ? (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-xs text-rose-900">
                  <strong>Materia Reservada a la Defensoría Oficial:</strong> Admisión prioritaria e indelegable. No aplica tope de ingresos restrictivo frente a situaciones de violencia o desamparo.
                </div>
              ) : (
                <div className="space-y-2 text-[11px]">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-600">
                        Umbral Verde {result.isRangoAmpliado ? "(Rango Ampliado 3 SMVM)" : result.isTopeDivorcio ? "(Tope Estricto Divorcio 1.5 SMVM)" : "(2 SMVM)"}:
                      </span>
                      <span className="font-bold text-slate-800 font-mono">{formatCurrency(result.threshold2SMVM)}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full transition-all duration-300 ${result.ina <= result.threshold2SMVM ? "bg-emerald-500" : "bg-slate-300"}`}
                        style={{ width: `${Math.min(100, Math.max(0, (result.ina / result.threshold2SMVM) * 100))}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-600">
                        Umbral Amarillo {result.isRangoAmpliado ? "(Rango Ampliado 4 SMVM)" : result.isTopeDivorcio ? "(Tope Divorcio 2 SMVM)" : "(3 SMVM)"}:
                      </span>
                      <span className="font-bold text-slate-800 font-mono">{formatCurrency(result.threshold3SMVM)}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full transition-all duration-300 ${result.ina <= result.threshold3SMVM ? "bg-amber-500" : "bg-slate-300"}`}
                        style={{ width: `${Math.min(100, Math.max(0, (result.ina / result.threshold3SMVM) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic rule explainers */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-[10px] text-slate-500 space-y-1">
              <strong className="text-slate-700 uppercase tracking-wide block mb-1">Métricas del Algoritmo Necochea:</strong>
              <p>• Trámite evaluado: <span className="font-bold text-slate-800">{result.tramiteNombre}</span> ({result.tramiteCategoria.replace('_', ' ').toUpperCase()}).</p>
              <p>• La Canasta Básica Total (CBT) del hogar representa el <span className="font-semibold text-indigo-700">{(ingresoBruto > 0 ? (result.cbtTotal / ingresoBruto) * 100 : 0).toFixed(1)}%</span> del ingreso bruto total.</p>
              <p>• El Índice de Vulnerabilidad Social otorgó <span className="font-semibold text-emerald-700">{result.ivsScore} de 8</span> puntos posibles.</p>
              {result.isShifted && (
                <p className="text-indigo-700 font-medium">• Reclasificación por equidad alimentaria (salto dinámico activado con prioridad en la subsistencia familiar).</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
