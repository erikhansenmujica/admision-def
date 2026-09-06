/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { EconomicParams } from "../types";
// Formatting is independent of the unavailable initial parameter values.
import { formatCurrency } from "../utils";
import { Settings, RefreshCw, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface Props {
  params: EconomicParams;
  onChange: (newParams: EconomicParams) => void;
  // Reuse the official download flow instead of clearing monetary references.
  onReset: () => void;
  isUpdating: boolean;
}

// Receive the shared request state so reset preserves provenance and error handling.
export default function EconomicParamsSettings({ params, onChange, onReset, isUpdating }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: keyof EconomicParams, val: number) => {
    onChange({
      ...params,
      [key]: val
    });
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 shadow-sm mb-6" id="settings-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-100 hover:bg-slate-200/70 transition-colors text-slate-800 font-medium"
        type="button"
        id="toggle-settings-btn"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-600 animate-spin-slow" />
          <div className="text-left">
            <span className="block text-sm font-semibold text-slate-900">Configuración de Parámetros Económicos</span>
            <span className="block text-xs text-slate-500 font-normal">Ajuste de SMVM, Canastas INDEC y Ponderación de Adolescentes (ingreso manual)</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-md font-mono">
            SMVM: {formatCurrency(params.smvm)}
          </span>
          {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 bg-white border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-5" id="settings-content">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Límites de Salario Mínimo</h4>
            <div className="flex flex-col gap-2">
              <label htmlFor="smvm-input" className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                Salario Mínimo, Vital y Móvil (SMVM):
                <div className="group relative">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg z-20 leading-relaxed">
                    Referencia base de admisión. 2 SMVM determina el límite del nivel Verde y 3 SMVM determina el nivel Amarillo.
                  </div>
                </div>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">$</span>
                <input
                  type="number"
                  id="smvm-input"
                  value={params.smvm}
                  onChange={(e) => handleChange("smvm", Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:bg-white transition-all font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-500 italic mt-1">
                Límite 2 SMVM: <strong className="font-mono">{formatCurrency(params.smvm * 2)}</strong> | Límite 3 SMVM: <strong className="font-mono">{formatCurrency(params.smvm * 3)}</strong>
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Canastas de Referencia INDEC (ingreso manual)</h4>
              <button
                type="button"
                // Prevent duplicate downloads while restoring the official values.
                onClick={onReset}
                disabled={isUpdating}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors bg-slate-100 px-2 py-1 rounded"
                id="reset-params-btn"
              >
                {/* Explain that restoring parameters retrieves official data. */}
                <RefreshCw className="w-3.5 h-3.5" /> {isUpdating ? "Consultando…" : "Restablecer valores oficiales"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="cba-input" className="text-[11px] font-medium text-slate-700">Canasta Básica Alimentaria (CBA) Adulto Equivalente:</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                  <input
                    type="number"
                    id="cba-input"
                    value={params.cba}
                    onChange={(e) => handleChange("cba", Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="cbt-input" className="text-[11px] font-medium text-slate-700">Canasta Básica Total (CBT) Adulto Equivalente:</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                  <input
                    type="number"
                    id="cbt-input"
                    value={params.cbt}
                    onChange={(e) => handleChange("cbt", Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold text-indigo-700"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="adults-count-input" className="text-[11px] font-medium text-slate-700 flex items-center gap-1">
                  Adultos de Referencia en el Hogar:
                  <div className="group relative">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                    <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block w-72 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg z-20 leading-relaxed">
                      Coeficiente equivalente de adultos del hogar excluyendo a los hijos. Por defecto es 1.0 (para el postulante unipersonal) o se ajusta según la cantidad de convivientes mayores de edad.
                    </div>
                  </div>
                </label>
                <input
                  type="number"
                  id="adults-count-input"
                  step="0.05"
                  value={params.adultsCount}
                  onChange={(e) => handleChange("adultsCount", Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
