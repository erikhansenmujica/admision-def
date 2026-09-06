/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Adult, TramiteCategory } from "../types";
import { TRAMITES_CATALOGUE, getTramiteDefinition, formatCurrency } from "../utils";
import { 
  FolderGit2, 
  Calendar, 
  ShieldCheck, 
  Scale, 
  ShieldAlert, 
  BrainCircuit, 
  HeartHandshake, 
  FileSpreadsheet, 
  Info,
  Sparkles,
  AlertCircle
} from "lucide-react";

interface Props {
  consultante: Adult;
  nroCarpetaSimp: string;
  tramiteTipo: string;
  tramiteCategoria: TramiteCategory;
  tramiteDetalle?: string;
  onUpdateConsultanteField: (key: keyof Adult, val: any) => void;
  onUpdateNroCarpetaSimp: (val: string) => void;
  onUpdateTramite: (tipoId: string, categoria: TramiteCategory, detalle?: string) => void;
  onUpdateTramiteDetalle: (val: string) => void;
}

export default function Section1Consultante({
  consultante,
  nroCarpetaSimp,
  tramiteTipo,
  tramiteCategoria,
  tramiteDetalle,
  onUpdateConsultanteField,
  onUpdateNroCarpetaSimp,
  onUpdateTramite,
  onUpdateTramiteDetalle
}: Props) {
  const currentTramite = getTramiteDefinition(tramiteTipo, tramiteCategoria);

  const categories: {
    id: TramiteCategory;
    label: string;
    badge: string;
    badgeColor: string;
    icon: React.ReactNode;
    description: string;
    highlightRule: string;
  }[] = [
    {
      id: "reservada",
      label: "Materias Reservadas Defensoría",
      badge: "Atención Exclusiva e Indelegable",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
      icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
      description: "Guardas, abrigos, filiaciones, tutelas, adopciones, alimentos ≤ 2 SMVM, violencia, amparos PROFE, daños penal.",
      highlightRule: "Competencia obligatoria e indelegable por Ley y Convenio. No se deriva a matrícula particular."
    },
    {
      id: "determinacion_capacidad",
      label: "Determinación de Capacidad",
      badge: "Rango de Ingresos Ampliado",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      icon: <BrainCircuit className="w-4 h-4 text-purple-600" />,
      description: "Revisión de capacidad jurídica, provisión de apoyos y salvaguardias (Art. 31 CCCN y Ley 26.657).",
      highlightRule: "Umbral ampliado a 3 SMVM (Verde) y 4 SMVM (Amarillo) por tutela de salud mental y discapacidad."
    },
    {
      id: "divorcio",
      label: "Divorcios (Situación Especial)",
      badge: "Tope Diferenciado: 1.5 SMVM",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      icon: <HeartHandshake className="w-4 h-4 text-amber-600" />,
      description: "Por regla derivación al Colegio de Abogados. Excepción: vulnerabilidad grave y actual + ingresos ≤ 1.5 SMVM.",
      highlightRule: "Tope diferenciado restrictivo de 1.5 SMVM (Verde) y 2 SMVM (Amarillo) sin contenido patrimonial."
    },
    {
      id: "sucesion_excepcional",
      label: "Sucesiones (Situación Especial)",
      badge: "Tope: 1.5 SMVM (Fundamento Social)",
      badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
      icon: <FileSpreadsheet className="w-4 h-4 text-orange-600" />,
      description: "Solo supuestos excepcionales con fundamento social grave acreditado y sin bienes registrables en disputa.",
      highlightRule: "Tope estricto de 1.5 SMVM (Verde) y 2 SMVM (Amarillo). Excluye sucesiones con conflicto patrimonial."
    },
    {
      id: "amparos",
      label: "Amparos (Ítem Diferencial)",
      badge: "PROFE vs Régimen General",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
      icon: <Sparkles className="w-4 h-4 text-teal-600" />,
      description: "Diferenciación entre amparo PROFE/PNC (Materia Reservada) y amparos de salud ordinarios (Régimen 2 SMVM).",
      highlightRule: "PROFE/PNC = Materia reservada; Obras sociales/Prepagas/IOMA = Régimen general de 2 SMVM."
    },
    {
      id: "danos_perjuicios",
      label: "Daños y Perjuicios (Ítem Diferencial)",
      badge: "Penal vs Letrados Particulares",
      badgeColor: "bg-stone-100 text-stone-800 border-stone-200",
      icon: <Scale className="w-4 h-4 text-stone-600" />,
      description: "Diferenciación entre causa penal con presos (Materia Reservada) y daños comunes (Derivación al Colegio).",
      highlightRule: "Penal/privados de libertad = Materia reservada; Ordinarios = Derivación al Colegio de Abogados."
    },
    {
      id: "general",
      label: "Materias Ordinarias / Familia y Civil",
      badge: "Régimen General (2 SMVM)",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <Scale className="w-4 h-4 text-blue-600" />,
      description: "Alimentos ordinarios (>2 SMVM demandado), desalojos de vivienda única y demás actuaciones civiles.",
      highlightRule: "Tope estándar de 2 SMVM (Verde) y 3 SMVM (Amarillo) tras deducir CBT, alquiler y salud."
    }
  ];

  const filteredTramites = TRAMITES_CATALOGUE.filter(t => t.category === tramiteCategoria);

  const handleCategoryChange = (catId: TramiteCategory) => {
    const firstInCat = TRAMITES_CATALOGUE.find(t => t.category === catId);
    if (firstInCat) {
      onUpdateTramite(firstInCat.id, catId, tramiteDetalle);
    }
  };

  const handleTramiteSelect = (tipoId: string) => {
    const def = TRAMITES_CATALOGUE.find(t => t.id === tipoId);
    if (def) {
      onUpdateTramite(def.id, def.category, tramiteDetalle);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6" id="section-1-consultante">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-xs">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">1) Identificación de Carpeta e Ingresos del Titular</h3>
            <p className="text-xs text-slate-500">Materia judicial según Convenio de Derivación e individualización del consultante</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Datos Personales Anonimizados (Ley 25.326)</span>
        </div>
      </div>

      {/* A) CARPETA SIMP */}
      <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100/80">
        <div className="flex justify-between items-center mb-1.5">
          <label htmlFor="nro-carpeta-simp" className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Nº de Carpeta SIMP (Sistema de Información del Ministerio Público)</span>
          </label>
          <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-100/70 px-2 py-0.5 rounded-md">Identificador Oficial</span>
        </div>
        <input
          type="text"
          id="nro-carpeta-simp"
          value={nroCarpetaSimp}
          onChange={(e) => onUpdateNroCarpetaSimp(e.target.value)}
          placeholder="Ej. SIMP-12-00-004521-26 o 12-00-012345-26/00"
          className="w-full bg-white border border-indigo-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-mono shadow-xs"
        />
        <p className="text-[10px] text-slate-500 mt-1">
          Preserva la privacidad: no se registran nombres, apellidos ni DNI en la base ni en las constancias.
        </p>
      </div>

      {/* B) TIPO DE TRÁMITE / MATERIA A REALIZAR SEGÚN CONVENIO */}
      <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-4" id="tramite-selector-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-700" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Tipo de Trámite a Realizar (Fuentes: Convenio de Derivación MPD - Colegio de Abogados)
            </h4>
          </div>
          <span className="text-[10px] text-slate-500 font-medium italic">
            Ajusta automáticamente los topes de ingresos y materias reservadas
          </span>
        </div>

        {/* Categorías Principales del Convenio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {categories.map((cat) => {
            const isSelected = tramiteCategoria === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all relative ${
                  isSelected
                    ? "bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs"
                    : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {cat.icon}
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{cat.label}</span>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                  )}
                </div>
                
                <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold border mb-1.5 ${cat.badgeColor}`}>
                  {cat.badge}
                </span>

                <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                  {cat.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selector de Trámite Específico de la Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="select-tramite-tipo" className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Trámite / Acción Judicial Específica:</span>
              <span className="text-[10px] text-indigo-600 font-semibold">{filteredTramites.length} opciones disponibles</span>
            </label>
            <select
              id="select-tramite-tipo"
              value={tramiteTipo}
              onChange={(e) => handleTramiteSelect(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all shadow-xs"
            >
              {filteredTramites.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="input-tramite-detalle" className="text-xs font-bold text-slate-700">
              Objeto u Observaciones del Trámite (Opcional):
            </label>
            <input
              type="text"
              id="input-tramite-detalle"
              value={tramiteDetalle || ""}
              onChange={(e) => onUpdateTramiteDetalle(e.target.value)}
              placeholder="Ej. Reclamo alimentario provisorio y régimen de comunicación..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Ficha Informativa del Trámite Seleccionado y Regla Económica Aplicada */}
        <div className={`p-3.5 rounded-xl border flex flex-col gap-1.5 ${
          currentTramite.category === "reservada"
            ? "bg-rose-50/70 border-rose-200 text-rose-950"
            : currentTramite.category === "determinacion_capacidad"
            ? "bg-purple-50/70 border-purple-200 text-purple-950"
            : currentTramite.category === "divorcio"
            ? "bg-amber-50/70 border-amber-200 text-amber-950"
            : currentTramite.category === "sucesion_excepcional"
            ? "bg-orange-50/70 border-orange-200 text-orange-950"
            : currentTramite.category === "amparos"
            ? "bg-teal-50/70 border-teal-200 text-teal-950"
            : currentTramite.category === "danos_perjuicios"
            ? "bg-stone-100/70 border-stone-300 text-stone-950"
            : "bg-blue-50/70 border-blue-200 text-blue-950"
        }`}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-bold">{currentTramite.name}</span>
            </div>
            <span className="text-[10px] font-semibold bg-white/80 px-2 py-0.5 rounded-full border border-current/20">
              Base Legal: {currentTramite.legalBasis}
            </span>
          </div>

          <p className="text-[11px] leading-relaxed">
            <strong>Criterio de Atención e Ingresos:</strong> {currentTramite.economicRule}
          </p>
        </div>
      </div>

      {/* C) DATOS SOCIODEMOGRÁFICOS DEL TITULAR */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <span>Variables Socioeconómicas del Titular / Consultante</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Edad */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edad-consultante" className="text-xs font-semibold text-slate-600">Edad (Años)</label>
            <div className="relative">
              <input
                type="number"
                id="edad-consultante"
                value={consultante.age === 0 ? "" : consultante.age}
                onChange={(e) => onUpdateConsultanteField("age", e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))}
                placeholder="Ej. 35"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all font-mono"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Sexo */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sexo-consultante" className="text-xs font-semibold text-slate-600">Sexo</label>
            <select
              id="sexo-consultante"
              value={consultante.sex}
              onChange={(e) => onUpdateConsultanteField("sex", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
            >
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Ingresos Mensuales */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ingreso-consultante" className="text-xs font-semibold text-slate-600">Ingreso Mensual Neto ($)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">$</span>
              <input
                type="number"
                id="ingreso-consultante"
                value={consultante.monthlyIncome === 0 ? "" : consultante.monthlyIncome}
                onChange={(e) => onUpdateConsultanteField("monthlyIncome", e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))}
                placeholder="0"
                className="w-full pl-7 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-semibold"
              />
            </div>
          </div>

          {/* Trabajo */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="trabajo-consultante" className="text-xs font-semibold text-slate-600">Situación Laboral</label>
            <select
              id="trabajo-consultante"
              value={consultante.jobType}
              onChange={(e) => onUpdateConsultanteField("jobType", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
            >
              <option value="Informal">Informal (Precarizado)</option>
              <option value="Formal">Formal (Registrado)</option>
              <option value="Desocupado / Sin ingresos">Desocupado / Sin ingresos</option>
            </select>
          </div>

          {/* Educación */}
          <div className="flex flex-col gap-1.5 sm:col-span-2 md:col-span-4">
            <label htmlFor="educacion-consultante" className="text-xs font-semibold text-slate-600">Máximo Nivel Educativo Alcanzado</label>
            <select
              id="educacion-consultante"
              value={consultante.educationLevel}
              onChange={(e) => onUpdateConsultanteField("educationLevel", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
            >
              <option value="Primario Incompleto">Primario Incompleto</option>
              <option value="Primario Completo">Primario Completo</option>
              <option value="Secundario Incompleto">Secundario Incompleto</option>
              <option value="Secundario Completo">Secundario Completo</option>
              <option value="Superior Incompleto">Superior Incompleto</option>
              <option value="Superior Completo">Superior Completo</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
