/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { SavedEvaluation, EvaluationInput, EvaluationResult, EconomicParams, JudicialLevel } from "../types";
import { formatCurrency, calculateCrianzaValue } from "../utils";
import { printSavedEvaluationActa } from "../utils/printHelper";
import { 
  Search, 
  Filter, 
  Trash2, 
  FileText, 
  FolderOpen, 
  Calendar, 
  User, 
  Users, 
  CheckCircle, 
  PlusCircle, 
  History,
  AlertCircle,
  Clock,
  Printer,
  ChevronRight,
  Sparkles,
  UserCheck,
  Download,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Saving requires verified references and an identified, nonempty consultation.
interface Props {
  canSave: boolean;
  activeInput: EvaluationInput;
  activeResult: EvaluationResult;
  activeParams: EconomicParams;
  onLoadCase: (input: EvaluationInput, params: EconomicParams) => void;
}

export default function CaseHistory({ canSave, activeInput, activeResult, activeParams, onLoadCase }: Props) {
  const [history, setHistory] = useState<SavedEvaluation[]>([]);
  const [nroCarpetaSimpInput, setNroCarpetaSimpInput] = useState<string>("");
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterLevel, setFilterLevel] = useState<string>("ALL"); // ALL, VERDE, AMARILLO, ROJO

  // Preserve real saved cases while removing the four legacy demo records.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("admision_judicial_historial") || "[]");
      const actual = Array.isArray(saved) ? saved.filter(item => item && !/^mock-[1-4]$/.test(item.id)) : [];
      setHistory(actual);
      localStorage.setItem("admision_judicial_historial", JSON.stringify(actual));
    } catch { setHistory([]); }
  }, []);

  // Sync to local storage on change
  const saveToStorage = (updatedList: SavedEvaluation[]) => {
    setHistory(updatedList);
    localStorage.setItem("admision_judicial_historial", JSON.stringify(updatedList));
  };

  // Generate dynamic expediente number
  const generateCaseNumber = () => {
    const year = new Date().getFullYear();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    return `#NC-${year}-${randNum}-ADM`;
  };

  const handleSaveCurrentCase = (e: React.FormEvent) => {
    e.preventDefault();
    // Guard submission as well as the disabled controls.
    if (!canSave) return;
    const carpetaToSave = (nroCarpetaSimpInput.trim() || activeInput.nroCarpetaSimp || "SIMP-S/N").trim();
    
    const now = new Date();
    const dateStr = now.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }) + ", " + now.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const newCase: SavedEvaluation = {
      id: Math.random().toString(36).substring(2, 9),
      dateStr,
      caseNumber: generateCaseNumber(),
      nroCarpetaSimp: carpetaToSave,
      input: {
        ...JSON.parse(JSON.stringify(activeInput)),
        nroCarpetaSimp: carpetaToSave
      },
      result: JSON.parse(JSON.stringify(activeResult)),
      params: JSON.parse(JSON.stringify(activeParams))
    };

    const updated = [newCase, ...history];
    saveToStorage(updated);
    setNroCarpetaSimpInput("");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteCase = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveToStorage(updated);
  };

  const handlePrintCase = (item: SavedEvaluation) => {
    printSavedEvaluationActa(item);
  };

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `respaldo_historial_simp_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          saveToStorage(parsed);
          alert("¡Historial importado con éxito!");
        }
      } catch {
        alert("El archivo seleccionado no tiene el formato JSON válido.");
      }
    };
    reader.readAsText(file);
  };

  // Filter & Search logic
  const filteredCases = history.filter((item) => {
    const matchesSearch = 
      (item.nroCarpetaSimp || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = 
      filterLevel === "ALL" || 
      item.result.finalLevel === filterLevel;

    return matchesSearch && matchesLevel;
  });

  const getBadgeColors = (level: JudicialLevel) => {
    switch (level) {
      case JudicialLevel.VERDE:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case JudicialLevel.AMARILLO:
        return "bg-amber-50 text-amber-700 border-amber-200";
      case JudicialLevel.ROJO:
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6" id="case-history-section">
      
      {/* SECTION TITLE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Historial de Evaluaciones SIMP</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Auditoría y registro anónimo del Departamento Judicial Necochea</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportBackup}
            type="button"
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
            title="Descargar archivo de respaldo de tus casos"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar Respaldo</span>
          </button>
          <label
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="Cargar archivo de respaldo de casos"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Importar</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full font-mono font-bold">
            Total: {history.length} carpetas
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ARCHIVE FORM - 4 COLS */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200/60 rounded-2xl p-5 h-fit flex flex-col justify-between" id="save-case-form-card">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono">Archivar Evaluación Activa</span>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              Guarde las variables configuradas actualmente en la pantalla (ingresos, gastos de salud, cargas de crianza, IVS) asociadas únicamente al Nº de Carpeta SIMP para auditorías o reimpresión del Acta.
            </p>

            {/* Keep prior cases available while an incomplete current case cannot be saved. */}
            <fieldset disabled={!canSave}>
            {!canSave && <p>Complete la carpeta SIMP, la edad y los parámetros económicos para guardar.</p>}
            <form onSubmit={handleSaveCurrentCase} className="space-y-3.5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="carpeta-simp-input" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Nº de Carpeta SIMP
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <FolderOpen className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    id="carpeta-simp-input"
                    value={nroCarpetaSimpInput || activeInput.nroCarpetaSimp || ""}
                    onChange={(e) => setNroCarpetaSimpInput(e.target.value)}
                    placeholder="Ej. SIMP-12-00-004521-26"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Current snapshot indicator */}
              <div className="bg-white rounded-xl border border-slate-200/60 p-3 space-y-2 text-[11px]">
                <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-1">
                  Resumen de lo que se guardará:
                </span>
                <div className="flex justify-between text-slate-600">
                  <span>Ingreso Neto Ajustado:</span>
                  <span className="font-semibold text-slate-800 font-mono">{formatCurrency(activeResult.ina)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Índice IVS:</span>
                  <span className="font-semibold text-slate-800 font-mono">{activeResult.ivsScore} pts</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Cargas de Crianza:</span>
                  <span className="font-semibold text-slate-800 font-mono">{activeInput.children.length} menor(es)</span>
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
                  <span>Nivel Determinado:</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getBadgeColors(activeResult.finalLevel)}`}>
                    {activeResult.finalLevel}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4" />
                Registrar en Historial SIMP
              </button>
            </form>
            </fieldset>

            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 flex items-center gap-2 text-xs font-semibold"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Evaluación guardada exitosamente bajo el Nº de Carpeta SIMP!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-dashed border-slate-200 mt-5 pt-4 text-[10px] text-slate-400 leading-normal">
            *Las evaluaciones se persisten en el navegador (Local Storage) de forma anónima, sin almacenar DNI ni nombres personales.
          </div>
        </div>

        {/* RIGHT COLUMN: ARCHIVE GRID - 8 COLS */}
        <div className="lg:col-span-8 space-y-4" id="archive-filter-and-list">
          
          {/* SEARCH & FILTER CONTROLS */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Buscar por Nº de Carpeta SIMP o Expediente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
              />
            </div>

            {/* Filter Levels Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0" id="semaphore-filter-tabs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1 hidden sm:inline-block">Filtrar:</span>
              {[
                { key: "ALL", label: "Todos" },
                { key: "VERDE", label: "Verde" },
                { key: "AMARILLO", label: "Amarillo" },
                { key: "ROJO", label: "Rojo" }
              ].map((pill) => {
                const isActive = filterLevel === pill.key;
                return (
                  <button
                    key={pill.key}
                    type="button"
                    onClick={() => setFilterLevel(pill.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shrink-0 ${
                      isActive 
                        ? pill.key === "VERDE" ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : pill.key === "AMARILLO" ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                          : pill.key === "ROJO" ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                          : "bg-slate-800 text-white border-slate-800 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* HISTORICAL ITEMS LIST */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1" id="saved-cases-scroller">
            <AnimatePresence initial={false}>
              {filteredCases.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 bg-slate-50 flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="w-8 h-8 text-slate-300" />
                  <span className="font-semibold">No se encontraron evaluaciones archivadas.</span>
                  <span className="text-[11px] text-slate-400">Modifica el criterio de búsqueda o archiva la carpeta activa.</span>
                </div>
              ) : (
                filteredCases.map((item) => {
                  const badgeClass = getBadgeColors(item.result.finalLevel);
                  const displayLevel = item.result.finalLevel;
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs hover:shadow-sm"
                    >
                      {/* Left Block: Basic Meta & Postulant */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
                          <span className="font-bold text-indigo-600">{item.caseNumber}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.dateStr}
                          </span>
                          {item.result.isShifted && (
                            <>
                              <span>•</span>
                              <span className="bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-sans font-bold text-[9px] flex items-center gap-0.5">
                                Reclasificado
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                            {item.nroCarpetaSimp || "SIMP-S/N"}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide border ${badgeClass}`}>
                            {displayLevel}
                          </span>
                        </div>

                        {/* Financial Parameters Snapshot */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-slate-50/60 p-2 rounded-xl border border-slate-100 font-sans">
                          <div>
                            <span className="block text-slate-400 font-medium">Ingr. Bruto:</span>
                            <span className="font-bold text-slate-700 font-mono">{formatCurrency(item.input.ingresoBruto)}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 font-medium">CBT Hogar (INDEC):</span>
                            <span className="font-bold text-rose-500 font-mono">-{formatCurrency(item.result.cbtTotal)} <span className="text-[9px] text-slate-400">({item.result.adeqTotal} ad. eq.)</span></span>
                          </div>
                          <div>
                            <span className="block text-slate-400 font-medium">Egreso Salud:</span>
                            <span className="font-bold text-rose-500 font-mono">-{formatCurrency(item.input.gastosSalud)}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 font-medium">INA Resultante:</span>
                            <span className="font-extrabold text-indigo-600 font-mono">{formatCurrency(item.result.ina)}</span>
                          </div>
                        </div>

                        {/* Children details and IVS breakdown */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-[11px] text-slate-500 pt-1">
                          <span className="flex items-center gap-1 shrink-0 bg-indigo-50/50 text-indigo-800 border border-indigo-100/40 px-2 py-0.5 rounded-lg">
                            <Users className="w-3.5 h-3.5" />
                            <strong>{item.input.children.length}</strong> menor(es)
                          </span>
                          
                          {/* Specific IVS display */}
                          <span className="flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg">
                            <span>IVS:</span>
                            <strong className="text-slate-900 font-mono">{item.result.ivsScore} pts</strong>
                            
                            {/* Inline dots for active factors */}
                            <span className="flex gap-1 ml-1">
                              {item.input.vulnerabilities.violenciaGenero && (
                                <span className="w-2 h-2 rounded-full bg-rose-500" title="Violencia (+3)" />
                              )}
                              {item.input.vulnerabilities.discapacidad && (
                                <span className="w-2 h-2 rounded-full bg-blue-500" title="CUD Discapacidad (+2)" />
                              )}
                              {item.input.vulnerabilities.hogarMonoparental && (
                                <span className="w-2 h-2 rounded-full bg-indigo-500" title="Monoparental (+2)" />
                              )}
                              {item.input.vulnerabilities.enfermedadTrabajoInformal && (
                                <span className="w-2 h-2 rounded-full bg-amber-500" title="Informal/Salud (+1)" />
                              )}
                            </span>
                          </span>

                          <span className="text-[10px] text-slate-400 truncate max-w-[280px]">
                            {item.input.children.map((c, i) => `Menor ${i + 1} (${c.ageBracket})`).join(', ')}
                          </span>
                        </div>
                      </div>

                      {/* Right Block: Actions */}
                      <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0 border-t border-slate-100 md:border-none pt-3 md:pt-0">
                        {/* Print Document Button */}
                        <button
                          type="button"
                          onClick={() => handlePrintCase(item)}
                          className="flex-1 md:flex-none px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 active:scale-[0.98]"
                          title="Descargar o imprimir acta oficial en PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Acta (PDF)</span>
                        </button>

                        <div className="flex gap-1.5 flex-1 md:flex-none">
                          {/* Load Back into form Button */}
                          <button
                            type="button"
                            onClick={() => onLoadCase(item.input, item.params)}
                            className="flex-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/50 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 active:scale-[0.98]"
                            title="Cargar estos datos en la calculadora para editar"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            <span>Cargar</span>
                          </button>

                          {/* Delete from archive Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteCase(item.id)}
                            className="p-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                            title="Eliminar del historial"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
