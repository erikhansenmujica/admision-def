/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Adult, Child, DisabledMinor, DisabledAdult, EconomicParams } from "../types";
import { 
  Users, 
  Plus, 
  Trash2, 
  Baby, 
  HeartHandshake, 
  ShieldAlert, 
  BadgeCheck, 
  Landmark, 
  CheckCircle2,
  DollarSign
} from "lucide-react";
import { 
  formatCurrency, 
  getChildEquivalentCoefficient, 
  getAdultEquivalentCoefficient,
  getBracketFromAge,
  getBracketLabel,
  calculateCrianzaValue
} from "../utils";

interface Props {
  // a) Menores a cargo
  childrenList: Child[];
  onAddChild: () => void;
  onRemoveChild: (id: string) => void;
  onUpdateChild: (id: string, key: keyof Child, val: any) => void;
  
  // b) Menores con discapacidad a cargo
  disabledMinors: DisabledMinor[];
  onAddDisabledMinor: () => void;
  onRemoveDisabledMinor: (id: string) => void;
  onUpdateDisabledMinor: (id: string, key: keyof DisabledMinor, val: any) => void;

  // c) Otros adultos convivientes (< 60 años)
  otherAdults: Adult[];
  onAddOtherAdult: () => void;
  onRemoveOtherAdult: (id: string) => void;
  onUpdateOtherAdult: (id: string, key: keyof Adult, val: any) => void;

  // d) Adultos con discapacidad a cargo
  disabledAdults: DisabledAdult[];
  onAddDisabledAdult: () => void;
  onRemoveDisabledAdult: (id: string) => void;
  onUpdateDisabledAdult: (id: string, key: keyof DisabledAdult, val: any) => void;

  // e) Adulto mayor (>= 60 años)
  elderlyAdults: Adult[];
  onAddElderlyAdult: () => void;
  onRemoveElderlyAdult: (id: string) => void;
  onUpdateElderlyAdult: (id: string, key: keyof Adult, val: any) => void;

  // Economic params for INDEC calculations
  params: EconomicParams;
}

export default function Section2GrupoFamiliar({
  childrenList,
  onAddChild,
  onRemoveChild,
  onUpdateChild,
  disabledMinors,
  onAddDisabledMinor,
  onRemoveDisabledMinor,
  onUpdateDisabledMinor,
  otherAdults,
  onAddOtherAdult,
  onRemoveOtherAdult,
  onUpdateOtherAdult,
  disabledAdults,
  onAddDisabledAdult,
  onRemoveDisabledAdult,
  onUpdateDisabledAdult,
  elderlyAdults,
  onAddElderlyAdult,
  onRemoveElderlyAdult,
  onUpdateElderlyAdult,
  params
}: Props) {
  // Calculations for subsection 2.a (Menores a cargo)
  const totalChildrenCbt = childrenList.reduce((sum, c) => sum + calculateCrianzaValue(c.ageBracket, params), 0);
  const totalChildrenAdeq = childrenList.reduce((sum, c) => sum + getChildEquivalentCoefficient(c.ageBracket), 0);
  const totalAuh = childrenList.filter(c => c.percibeAUH).reduce((sum, c) => sum + (c.montoAUH || 0), 0);
  const totalCuota = childrenList.filter(c => c.percibeCuotaAlimentaria).reduce((sum, c) => sum + (c.montoCuotaAlimentaria || 0), 0);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-7" id="section-2-grupo-familiar">
      {/* Main Section Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 shadow-xs">
          <Users className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">2) Composición del Grupo Familiar</h3>
          <p className="text-xs text-slate-500">
            Registro pormenorizado de menores, personas con discapacidad, convivientes y adultos mayores
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2.a) MENORES A CARGO */}
      {/* ========================================================================= */}
      <div className="space-y-4 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80" id="sub-2-a-menores">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-rose-100 flex items-center justify-center text-rose-600">
              <Baby className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                a) Menores a Cargo, Cantidad, Edades, CBT INDEC, AUH y Cuota Alimentaria
              </h4>
              <p className="text-[11px] text-slate-500">
                Total menores: <strong className="text-rose-700 font-semibold">{childrenList.length}</strong> | CBT INDEC total: <strong className="text-rose-700 font-mono font-semibold">{formatCurrency(totalChildrenCbt)}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onAddChild}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs self-start sm:self-auto active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Menor
          </button>
        </div>

        {/* Children List */}
        {childrenList.length === 0 ? (
          <div className="text-center py-5 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 bg-white">
            No hay menores de edad registrados a cargo del consultante.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {childrenList.map((child, index) => {
              const coef = getChildEquivalentCoefficient(child.ageBracket);
              const cost = calculateCrianzaValue(child.ageBracket, params);
              return (
                <div key={child.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs relative space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] flex items-center justify-center border border-rose-200">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={child.name}
                        onChange={(e) => onUpdateChild(child.id, "name", e.target.value)}
                        placeholder={`Menor ${index + 1}`}
                        className="font-bold text-xs text-slate-800 bg-transparent border-none p-0 focus:ring-0 w-48 placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-mono">
                        CBT INDEC: {formatCurrency(cost)} ({coef} ad. eq.)
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveChild(child.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Eliminar menor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Edades, Rango Etario y Sexo */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Edad Exacta (Años)</label>
                      <input
                        type="number"
                        min="0"
                        max="18"
                        value={child.age !== undefined && child.age !== null ? child.age : ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : Number(e.target.value);
                          onUpdateChild(child.id, "age", val);
                          onUpdateChild(child.id, "ageBracket", getBracketFromAge(val));
                        }}
                        placeholder="Ej. 7"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Rango Etario INDEC</label>
                      <select
                        value={child.ageBracket}
                        onChange={(e) => onUpdateChild(child.id, "ageBracket", e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700"
                      >
                        <option value="under1">Lactancia (&lt;1 año) - Coef 0.35</option>
                        <option value="1to3">1 a 3 años - Coef 0.45</option>
                        <option value="4to5">4 a 5 años - Coef 0.60</option>
                        <option value="6to12">6 a 12 años - Coef 0.75</option>
                        <option value="13to18">13 a 18 años - Coef 1.00</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Sexo</label>
                      <select
                        value={child.sex}
                        onChange={(e) => onUpdateChild(child.id, "sex", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700"
                      >
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>

                  {/* AUH y Cuota Alimentaria */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    {/* AUH */}
                    <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                          <Landmark className="w-3.5 h-3.5 text-blue-600" />
                          ¿Percibe AUH ANSES?
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateChild(child.id, "percibeAUH", true);
                              // Enter the amount actually received; eligibility does not determine the payment.
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                              child.percibeAUH ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            Sí
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateChild(child.id, "percibeAUH", false);
                              onUpdateChild(child.id, "montoAUH", 0);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                              !child.percibeAUH ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                      {child.percibeAUH && (
                        <div className="flex items-center gap-1.5 animate-fade-in">
                          <span className="text-[10px] text-slate-500 font-semibold">Monto mensual: $</span>
                          <input
                            type="number"
                            value={child.montoAUH || ""}
                            onChange={(e) => onUpdateChild(child.id, "montoAUH", e.target.value === "" ? 0 : Number(e.target.value))}
                            placeholder="Ej. 90000"
                            className="w-28 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-xs font-mono font-bold text-slate-800"
                          />
                        </div>
                      )}
                    </div>

                    {/* Cuota Alimentaria */}
                    <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                          <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                          ¿Percibe Cuota Alimentaria?
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateChild(child.id, "percibeCuotaAlimentaria", true);
                              if (!child.montoCuotaAlimentaria) onUpdateChild(child.id, "montoCuotaAlimentaria", 70000);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                              child.percibeCuotaAlimentaria ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            Sí
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateChild(child.id, "percibeCuotaAlimentaria", false);
                              onUpdateChild(child.id, "montoCuotaAlimentaria", 0);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                              !child.percibeCuotaAlimentaria ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                      {child.percibeCuotaAlimentaria && (
                        <div className="flex items-center gap-1.5 animate-fade-in">
                          <span className="text-[10px] text-slate-500 font-semibold">Monto mensual: $</span>
                          <input
                            type="number"
                            value={child.montoCuotaAlimentaria || ""}
                            onChange={(e) => onUpdateChild(child.id, "montoCuotaAlimentaria", e.target.value === "" ? 0 : Number(e.target.value))}
                            placeholder="Ej. 70000"
                            className="w-28 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-xs font-mono font-bold text-slate-800"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2.b) MENORES CON DISCAPACIDAD A CARGO */}
      {/* ========================================================================= */}
      <div className="space-y-4 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80" id="sub-2-b-menores-discapacidad">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center text-purple-600">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                b) Menores con Discapacidad a Cargo, Edades y Diagnóstico / CUD
              </h4>
              <p className="text-[11px] text-slate-500">
                Ponderación automática en IVS (+2 pts de vulnerabilidad social)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onAddDisabledMinor}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs self-start sm:self-auto active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Menor con Discapacidad
          </button>
        </div>

        {disabledMinors.length === 0 ? (
          <div className="text-center py-4 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 bg-white">
            No se declararon menores con discapacidad a cargo en el grupo familiar.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {disabledMinors.map((minor, idx) => (
              <div key={minor.id} className="bg-white border border-purple-200 rounded-2xl p-4 shadow-2xs space-y-3 relative">
                <button
                  type="button"
                  onClick={() => onRemoveDisabledMinor(minor.id)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Nombre / Identificación</label>
                  <input
                    type="text"
                    value={minor.name}
                    onChange={(e) => onUpdateDisabledMinor(minor.id, "name", e.target.value)}
                    placeholder={`Menor con discapacidad ${idx + 1}`}
                    className="w-3/4 font-bold text-xs text-slate-800 bg-transparent border-none p-0 focus:ring-0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Edad (Años)</label>
                    <input
                      type="number"
                      min="0"
                      max="18"
                      value={minor.age === 0 ? "" : minor.age}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : Number(e.target.value);
                        onUpdateDisabledMinor(minor.id, "age", val);
                        onUpdateDisabledMinor(minor.id, "ageBracket", getBracketFromAge(val));
                      }}
                      placeholder="Ej. 10"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">¿Posee CUD?</label>
                    <select
                      value={minor.hasCUD ? "true" : "false"}
                      onChange={(e) => onUpdateDisabledMinor(minor.id, "hasCUD", e.target.value === "true")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700"
                    >
                      <option value="true">Sí (CUD Vigente)</option>
                      <option value="false">En trámite / Sin CUD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Diagnóstico / Condición</label>
                  <input
                    type="text"
                    value={minor.diagnosis}
                    onChange={(e) => onUpdateDisabledMinor(minor.id, "diagnosis", e.target.value)}
                    placeholder="Ej. TEA, Parálisis cerebral, etc."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2.c) OTROS ADULTOS CONVIVIENTES (< 60 AÑOS) */}
      {/* ========================================================================= */}
      <div className="space-y-4 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80" id="sub-2-c-otros-adultos">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                c) Otros Adultos Convivientes (Menores a 60 años), Parentesco, Actividad e Ingresos
              </h4>
              <p className="text-[11px] text-slate-500">
                Sus ingresos computan directamente en el ingreso bruto total del grupo familiar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onAddOtherAdult}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs self-start sm:self-auto active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Adulto Conviviente
          </button>
        </div>

        {otherAdults.length === 0 ? (
          <div className="text-center py-4 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 bg-white">
            No hay otros adultos menores a 60 años que convivan con el solicitante.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherAdults.map((adult) => (
              <div key={adult.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 relative shadow-2xs">
                <button
                  type="button"
                  onClick={() => onRemoveOtherAdult(adult.id)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Nombre</label>
                    <input
                      type="text"
                      value={adult.name}
                      onChange={(e) => onUpdateOtherAdult(adult.id, "name", e.target.value)}
                      placeholder="Nombre del Conviviente"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Parentesco con Solicitante</label>
                    <select
                      value={adult.relationship || "Cónyuge / Pareja"}
                      onChange={(e) => onUpdateOtherAdult(adult.id, "relationship", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700"
                    >
                      <option value="Cónyuge / Pareja">Cónyuge / Pareja</option>
                      <option value="Hijo/a mayor de 18">Hijo/a mayor de 18</option>
                      <option value="Hermano/a">Hermano/a</option>
                      <option value="Padre/Madre">Padre/Madre</option>
                      <option value="Otro familiar">Otro familiar</option>
                      <option value="Sin parentesco">Sin parentesco</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Edad (&lt; 60)</label>
                    <input
                      type="number"
                      max="59"
                      value={adult.age === 0 ? "" : adult.age}
                      onChange={(e) => onUpdateOtherAdult(adult.id, "age", e.target.value === "" ? 0 : Number(e.target.value))}
                      placeholder="Ej. 34"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Sexo</label>
                    <select
                      value={adult.sex}
                      onChange={(e) => onUpdateOtherAdult(adult.id, "sex", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700"
                    >
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Actividad Laboral</label>
                    <select
                      value={adult.jobType}
                      onChange={(e) => onUpdateOtherAdult(adult.id, "jobType", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700"
                    >
                      <option value="Formal">Formal (Registrado)</option>
                      <option value="Informal">Informal (Precarizado)</option>
                      <option value="Desocupado / Sin ingresos">Desocupado / Cuidados</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Ingresos Mensuales ($)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">$</span>
                      <input
                        type="number"
                        value={adult.monthlyIncome === 0 ? "" : adult.monthlyIncome}
                        onChange={(e) => onUpdateOtherAdult(adult.id, "monthlyIncome", e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))}
                        placeholder="0"
                        className="w-full pl-6 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2.d) ADULTOS CON DISCAPACIDAD A CARGO */}
      {/* ========================================================================= */}
      <div className="space-y-4 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80" id="sub-2-d-adultos-discapacidad">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                d) Adultos con Discapacidad a Cargo, Edad y Diagnóstico / CUD
              </h4>
              <p className="text-[11px] text-slate-500">
                Ponderación de cuidados de adultos con dependencia o certificado CUD
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onAddDisabledAdult}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs self-start sm:self-auto active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Adulto con Discapacidad
          </button>
        </div>

        {disabledAdults.length === 0 ? (
          <div className="text-center py-4 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 bg-white">
            No se declararon adultos con discapacidad a cargo en el hogar.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {disabledAdults.map((adult, idx) => (
              <div key={adult.id} className="bg-white border border-indigo-200 rounded-2xl p-4 shadow-2xs space-y-3 relative">
                <button
                  type="button"
                  onClick={() => onRemoveDisabledAdult(adult.id)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Nombre</label>
                    <input
                      type="text"
                      value={adult.name}
                      onChange={(e) => onUpdateDisabledAdult(adult.id, "name", e.target.value)}
                      placeholder={`Adulto con discapacidad ${idx + 1}`}
                      className="w-full font-bold text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Parentesco</label>
                    <input
                      type="text"
                      value={adult.relationship || ""}
                      onChange={(e) => onUpdateDisabledAdult(adult.id, "relationship", e.target.value)}
                      placeholder="Ej. Hermano, Hijo/a mayor"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Edad</label>
                    <input
                      type="number"
                      value={adult.age === 0 ? "" : adult.age}
                      onChange={(e) => onUpdateDisabledAdult(adult.id, "age", e.target.value === "" ? 0 : Number(e.target.value))}
                      placeholder="Ej. 42"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">¿Posee CUD?</label>
                    <select
                      value={adult.hasCUD ? "true" : "false"}
                      onChange={(e) => onUpdateDisabledAdult(adult.id, "hasCUD", e.target.value === "true")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700"
                    >
                      <option value="true">Sí (CUD Vigente)</option>
                      <option value="false">En trámite / Sin CUD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Diagnóstico / Condición</label>
                  <input
                    type="text"
                    value={adult.diagnosis}
                    onChange={(e) => onUpdateDisabledAdult(adult.id, "diagnosis", e.target.value)}
                    placeholder="Ej. Discapacidad motriz, neurológica, etc."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2.e) ADULTO MAYOR A 60 AÑOS CONVIVIENTE */}
      {/* ========================================================================= */}
      <div className="space-y-4 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80" id="sub-2-e-adultos-mayores">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center text-amber-700">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                e) Adultos Mayores a 60 años Convivientes, Jubilación/Pensión y Monto Mensual
              </h4>
              <p className="text-[11px] text-slate-500">
                Registro de haberes jubilatorios, pensiones o adultos mayores a cargo en el hogar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onAddElderlyAdult}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs self-start sm:self-auto active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Adulto Mayor (≥ 60)
          </button>
        </div>

        {elderlyAdults.length === 0 ? (
          <div className="text-center py-4 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 bg-white">
            No se declararon adultos mayores de 60 años convivientes.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {elderlyAdults.map((adult) => {
              const coef = getAdultEquivalentCoefficient(adult.age, adult.sex);
              return (
                <div key={adult.id} className="bg-white border border-amber-200 rounded-2xl p-4 space-y-3 relative shadow-2xs">
                  <button
                    type="button"
                    onClick={() => onRemoveElderlyAdult(adult.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Nombre</label>
                      <input
                        type="text"
                        value={adult.name}
                        onChange={(e) => onUpdateElderlyAdult(adult.id, "name", e.target.value)}
                        placeholder="Nombre"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Parentesco</label>
                      <input
                        type="text"
                        value={adult.relationship || ""}
                        onChange={(e) => onUpdateElderlyAdult(adult.id, "relationship", e.target.value)}
                        placeholder="Ej. Padre/Madre, Abuelo/a"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Edad (≥ 60)</label>
                      <input
                        type="number"
                        min="60"
                        value={adult.age === 0 ? "" : adult.age}
                        onChange={(e) => onUpdateElderlyAdult(adult.id, "age", e.target.value === "" ? 0 : Number(e.target.value))}
                        placeholder="Ej. 68"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Sexo</label>
                      <select
                        value={adult.sex}
                        onChange={(e) => onUpdateElderlyAdult(adult.id, "sex", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700"
                      >
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>

                  {/* Beneficio de Jubilación o Pensión */}
                  <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                        <Landmark className="w-3.5 h-3.5 text-amber-700" />
                        ¿Beneficiario de Jubilación / Pensión?
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateElderlyAdult(adult.id, "isPensioner", true);
                            if (!adult.pensionType) onUpdateElderlyAdult(adult.id, "pensionType", "Jubilación mínima");
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                            adult.isPensioner !== false ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Sí
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateElderlyAdult(adult.id, "isPensioner", false);
                            onUpdateElderlyAdult(adult.id, "monthlyIncome", 0);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                            adult.isPensioner === false ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {adult.isPensioner !== false && (
                      <div className="grid grid-cols-2 gap-2 pt-1 animate-fade-in">
                        <div>
                          <label className="text-[9px] font-bold text-amber-800 uppercase block mb-1">Tipo de Beneficio</label>
                          <select
                            value={adult.pensionType || "Jubilación mínima"}
                            onChange={(e) => onUpdateElderlyAdult(adult.id, "pensionType", e.target.value)}
                            className="w-full bg-white border border-amber-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700"
                          >
                            <option value="Jubilación ordinaria / mínima">Jubilación ordinaria / mínima</option>
                            <option value="Pensión por fallecimiento">Pensión por fallecimiento</option>
                            <option value="PUAM (Pensión Universal)">PUAM (Pensión Universal)</option>
                            <option value="Pensión No Contributiva (PNC)">PNC (No Contributiva)</option>
                            <option value="Otro beneficio previsional">Otro beneficio</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9px] font-bold text-amber-800 uppercase block mb-1">Monto Mensual Percibido ($)</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-700 text-xs font-bold">$</span>
                            <input
                              type="number"
                              value={adult.monthlyIncome === 0 ? "" : adult.monthlyIncome}
                              onChange={(e) => onUpdateElderlyAdult(adult.id, "monthlyIncome", e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))}
                              placeholder="Ej. 380000"
                              className="w-full pl-6 pr-2 py-1 text-xs bg-white border border-amber-300 rounded-lg font-mono font-bold text-amber-950"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium pt-1">
                    <span>Coeficiente INDEC del Adulto Mayor:</span>
                    <span className="font-bold text-amber-700 font-mono bg-amber-50 px-2 py-0.5 rounded">
                      {coef.toFixed(2)} ad. eq.
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
