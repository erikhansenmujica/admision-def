/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { VulnerabilityFactors } from "../types";
import { ShieldCheck, Heart, Users, Activity, HelpCircle } from "lucide-react";

interface Props {
  vulnerabilities: VulnerabilityFactors;
  onChange: (newVulnerabilities: VulnerabilityFactors) => void;
}

export default function VulnerabilidadSelector({ vulnerabilities, onChange }: Props) {
  const toggleFactor = (key: keyof VulnerabilityFactors) => {
    onChange({
      ...vulnerabilities,
      [key]: !vulnerabilities[key]
    });
  };

  const calculateScore = () => {
    let score = 0;
    if (vulnerabilities.violenciaGenero) score += 3;
    if (vulnerabilities.discapacidad) score += 2;
    if (vulnerabilities.hogarMonoparental) score += 2;
    if (vulnerabilities.enfermedadTrabajoInformal) score += 1;
    return score;
  };

  const currentScore = calculateScore();

  const factors = [
    {
      key: "violenciaGenero" as const,
      points: 3,
      title: "Situación de Violencia (Género o Familiar)",
      desc: "Violencia intrafamiliar, denuncias vigentes, medidas cautelares o asistencia activa por equipos de género oficiales.",
      icon: ShieldCheck,
      color: "border-rose-200 bg-rose-50/20 text-rose-700 active-bg-rose-100",
      activeColor: "border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500/20"
    },
    {
      key: "discapacidad" as const,
      points: 2,
      title: "Discapacidad (Propia o Familiar)",
      desc: "Certificado Único de Discapacidad (CUD) del postulante o de algún integrante de su grupo familiar directo conviviente.",
      icon: Users,
      color: "border-cyan-200 bg-cyan-50/20 text-cyan-700 active-bg-cyan-100",
      activeColor: "border-cyan-500 bg-cyan-50 text-cyan-900 ring-2 ring-cyan-500/20"
    },
    {
      key: "hogarMonoparental" as const,
      points: 2,
      title: "Hogar Monoparental / Adulto Mayor",
      desc: "A cargo exclusivo de un solo progenitor, o postulante adulto mayor con cargas familiares o limitaciones severas de subsistencia.",
      icon: Heart,
      color: "border-amber-200 bg-amber-50/20 text-amber-700 active-bg-amber-100",
      activeColor: "border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20"
    },
    {
      key: "enfermedadTrabajoInformal" as const,
      points: 1,
      title: "Enfermedad Grave / Trabajo Informal",
      desc: "Enfermedad crónica compleja que requiera tratamiento costoso constante, o ingresos percibidos únicamente del sector informal.",
      icon: Activity,
      color: "border-emerald-200 bg-emerald-50/20 text-emerald-700 active-bg-emerald-100",
      activeColor: "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20"
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm" id="vulnerability-selector-container">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Índice de Vulnerabilidad Social (IVS)
          </h3>
          <p className="text-xs text-slate-500">Ponderadores de vulnerabilidad social y humana contemplados en el Convenio de Necochea.</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Puntaje IVS</span>
          <span className="text-lg font-bold text-emerald-700 font-mono" id="ivs-score-badge">
            {currentScore} <span className="text-xs text-slate-400 font-normal">/ 8 pts</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4" id="vulnerability-cards-grid">
        {factors.map((factor) => {
          const isActive = vulnerabilities[factor.key];
          const IconComponent = factor.icon;

          return (
            <button
              key={factor.key}
              type="button"
              onClick={() => toggleFactor(factor.key)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 relative overflow-hidden ${
                isActive ? factor.activeColor : "bg-white border-slate-200 hover:bg-slate-50/80 hover:border-slate-300"
              }`}
              id={`vulnerability-card-${factor.key}`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${isActive ? "bg-white border shadow-sm" : "bg-slate-100 text-slate-500"}`}>
                <IconComponent className={`w-5 h-5 ${isActive ? "text-emerald-600" : ""}`} />
              </div>

              <div className="flex-1 pr-6">
                <span className="block text-xs font-bold text-slate-800 leading-tight mb-1">
                  {factor.title}
                </span>
                <span className="block text-[11px] text-slate-500 leading-relaxed font-normal">
                  {factor.desc}
                </span>
              </div>

              <span className={`absolute top-3 right-3 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                isActive ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                +{factor.points} pts
              </span>
            </button>
          );
        })}
      </div>

      {/* Visual dynamic feedback gauge */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center gap-4" id="vulnerability-gauge-container">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
            <span>Sólido Legal/Vulnerable</span>
            <span>Alta Vulnerabilidad (IVS &gt;= 5)</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                currentScore >= 5
                  ? "bg-gradient-to-r from-emerald-500 to-green-600"
                  : currentScore >= 3
                  ? "bg-amber-500"
                  : "bg-slate-400"
              }`}
              style={{ width: `${(currentScore / 8) * 100}%` }}
              id="ivs-progress-bar"
            />
          </div>
        </div>
        <div className="shrink-0 text-center px-2 py-1 rounded bg-white border border-slate-200">
          <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-none">Estado IVS</span>
          <span className={`text-[11px] font-bold ${currentScore >= 5 ? "text-emerald-700" : currentScore >= 3 ? "text-amber-700" : "text-slate-600"}`}>
            {currentScore >= 5 ? "Alta vulnerabilidad" : currentScore >= 3 ? "Vulnerabilidad media" : "Vulnerabilidad básica"}
          </span>
        </div>
      </div>
    </div>
  );
}
