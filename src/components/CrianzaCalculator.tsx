/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Child, EconomicParams } from "../types";
import { calculateCrianzaValue, formatCurrency } from "../utils";
import { Plus, Trash2, Baby, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  childrenList: Child[];
  onChange: (newList: Child[]) => void;
  params: EconomicParams;
}

export default function CrianzaCalculator({ childrenList, onChange, params }: Props) {
  const addChild = () => {
    const newChild: Child = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Hijo/a ${childrenList.length + 1}`,
      ageBracket: "6to12",
      sex: "Femenino"
    };
    onChange([...childrenList, newChild]);
  };

  const removeChild = (id: string) => {
    onChange(childrenList.filter((c) => c.id !== id));
  };

  const updateChild = (id: string, key: keyof Child, val: any) => {
    onChange(
      childrenList.map((c) => {
        if (c.id === id) {
          return { ...c, [key]: val };
        }
        return c;
      })
    );
  };

  const totalCrianza = childrenList.reduce(
    (sum, c) => sum + calculateCrianzaValue(c.ageBracket, params),
    0
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm" id="crianza-calculator-container">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Baby className="w-5 h-5 text-indigo-600" /> Cargas de Crianza (Hijos/as)
          </h3>
          <p className="text-xs text-slate-500">Registre los hijos/as a cargo para computar el costo de cuidado y manutención oficial.</p>
        </div>
        <button
          type="button"
          onClick={addChild}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          id="add-child-btn"
        >
          <Plus className="w-4 h-4" /> Agregar Hijo/a
        </button>
      </div>

      <div className="space-y-4 mb-4" id="children-list-container">
        <AnimatePresence initial={false}>
          {childrenList.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-8 px-4 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50"
              id="empty-children-state"
            >
              <p className="text-xs text-slate-500 font-medium">No se han registrado hijos a cargo.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Haga clic en "Agregar Hijo/a" para iniciar el cálculo del costo real de crianza.</p>
            </motion.div>
          ) : (
            childrenList.map((child, index) => {
              const currentValue = calculateCrianzaValue(child.ageBracket, params);
              return (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, height: 0, y: 15 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -15 }}
                  transition={{ type: "spring", duration: 0.3 }}
                  className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 relative group"
                  id={`child-card-${child.id}`}
                >
                  <button
                    type="button"
                    onClick={() => removeChild(child.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition-colors p-1 bg-white hover:bg-rose-50 border border-slate-100 rounded-md shadow-sm"
                    title="Eliminar registro"
                    id={`remove-child-${child.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-3 flex flex-col gap-1">
                      <label htmlFor={`child-name-${child.id}`} className="text-xs font-semibold text-slate-600">Nombre</label>
                      <input
                        type="text"
                        id={`child-name-${child.id}`}
                        value={child.name}
                        onChange={(e) => updateChild(child.id, "name", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                        placeholder="Nombre o Identificador"
                      />
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-1">
                      <label htmlFor={`child-sex-${child.id}`} className="text-xs font-semibold text-slate-600">Sexo</label>
                      <select
                        id={`child-sex-${child.id}`}
                        value={child.sex || "Femenino"}
                        onChange={(e) => updateChild(child.id, "sex", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all font-semibold text-slate-600"
                      >
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>

                    <div className="md:col-span-7 flex flex-col gap-1">
                      <span className="text-xs font-semibold text-slate-600">Tramo de Edad e Índice Mensual</span>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
                        {[
                          { key: "under1", label: "< 1 año", desc: "Lactancia" },
                          { key: "1to3", label: "1 a 3 años", desc: "Maternal" },
                          { key: "4to5", label: "4 a 5 años", desc: "Preescolar" },
                          { key: "6to12", label: "6 a 12 años", desc: "Escolar" },
                          { key: "13to18", label: "13 a 18 años", desc: "Adolescente", isAdolescent: true }
                        ].map((bracket) => {
                          const isSelected = child.ageBracket === bracket.key;
                          return (
                            <button
                              key={bracket.key}
                              type="button"
                              onClick={() => updateChild(child.id, "ageBracket", bracket.key)}
                              className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-center transition-all ${
                                isSelected
                                  ? bracket.isAdolescent
                                    ? "bg-violet-50 border-violet-500 text-violet-800 font-semibold shadow-sm"
                                    : "bg-indigo-50 border-indigo-500 text-indigo-800 font-semibold shadow-sm"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                              }`}
                              id={`bracket-btn-${child.id}-${bracket.key}`}
                            >
                              <span className="text-[10px] leading-tight block">{bracket.label}</span>
                              <span className="text-[9px] text-slate-400 font-normal block leading-tight">{bracket.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Costo asignado: <strong className="font-mono text-slate-700">{formatCurrency(currentValue)}</strong>
                    </span>
                    {child.ageBracket === "13to18" && (
                      <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-800 px-2 py-0.5 rounded-md font-medium text-[10px]">
                        <Award className="w-3 h-3 text-violet-700" /> Ponderación Adolescente (1.5x bienes y servicios)
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 flex items-center justify-between" id="crianza-total-banner">
        <span className="text-xs font-semibold text-indigo-900">Costo Total de Crianza Familiar (CC_Total):</span>
        <span className="text-base font-bold text-indigo-700 font-mono" id="crianza-total-amount">
          {formatCurrency(totalCrianza)}
        </span>
      </div>
    </div>
  );
}
