/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { EvaluationInput, EvaluationResult, EconomicParams } from "../types";
import { FileText, ShieldCheck } from "lucide-react";
import ActaDocument from "./ActaDocument";

interface Props {
  input: EvaluationInput;
  result: EvaluationResult;
  params: EconomicParams;
  nroCarpetaSimp: string;
  fechaConsulta: string;
  onUpdateFechaConsulta: (val: string) => void;
}

export default function Section6PrintablePanel({
  input,
  result,
  params,
  nroCarpetaSimp,
  fechaConsulta,
  onUpdateFechaConsulta
}: Props) {
  return (
    <div className="space-y-4" id="section-5-printable-panel">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">5) Informe para Imprimir (Acta Oficial de Evaluación)</h3>
            <p className="text-xs text-slate-500">Exporte el acta de admisibilidad formal con validez institucional</p>
          </div>
        </div>

        {/* Data Review and Date Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Nº de Carpeta SIMP</span>
              <span className="font-bold text-slate-800 block mt-1 font-mono text-sm">
                {nroCarpetaSimp || <span className="text-amber-600 italic font-semibold text-xs">Sin especificar (completar en Paso 1)</span>}
              </span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Anonimizado
            </span>
          </div>

          <div className="flex flex-col gap-1 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <label htmlFor="fecha-consulta-input" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fecha de Evaluación</label>
            <div className="relative">
              <input
                type="date"
                id="fecha-consulta-input"
                value={fechaConsulta}
                onChange={(e) => onUpdateFechaConsulta(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Informative notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 leading-relaxed mb-6">
          <p className="font-bold text-slate-700">Validez del Informe y Protección de Datos:</p>
          <p className="mt-1">
            Este informe se genera de forma instantánea conforme a los parámetros económicos y sociofamiliares cargados. En resguardo de la privacidad de las personas (Ley de Protección de Datos Personales Nº 25.326), el acta se emite referenciada únicamente con el número de Carpeta SIMP oficial.
          </p>
        </div>

        {/* Act Document Renders Here with high quality */}
        <ActaDocument input={input} result={result} params={params} />
      </div>
    </div>
  );
}
