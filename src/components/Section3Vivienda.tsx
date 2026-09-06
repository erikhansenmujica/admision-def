/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HousingType, OccupancyStatus } from "../types";
import { Home, KeyRound, HeartPulse, Building2 } from "lucide-react";
import { formatCurrency } from "../utils";

interface Props {
  housingType: HousingType;
  occupancyStatus: OccupancyStatus;
  montoAlquiler: number;
  // Coverage is recorded independently of out-of-pocket medical costs.
  poseeObraSocial?: boolean;
  onUpdateObraSocial: (val: boolean | undefined) => void;
  gastosSalud: number;
  onUpdateHousing: (val: HousingType) => void;
  onUpdateOccupancy: (val: OccupancyStatus) => void;
  onUpdateMontoAlquiler: (val: number) => void;
  onUpdateGastosSalud: (val: number) => void;
}

export default function Section3Vivienda({
  housingType,
  occupancyStatus,
  montoAlquiler,
  // Bind coverage to the persisted case state.
  poseeObraSocial,
  onUpdateObraSocial,
  gastosSalud,
  onUpdateHousing,
  onUpdateOccupancy,
  onUpdateMontoAlquiler,
  onUpdateGastosSalud
}: Props) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5" id="section-3-vivienda">
      {/* Title */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 shadow-xs">
          <Home className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">3) Datos de Vivienda y Gastos Indispensables</h3>
          <p className="text-xs text-slate-500">
            Régimen de tenencia, tipo de inmueble, canon locativo de alquiler y gastos médicos crónicos
          </p>
        </div>
      </div>

      {/* Keep all housing inputs together before the health subsection. */}
      <section aria-labelledby="vivienda-heading" className="space-y-4">
      <h4 id="vivienda-heading" className="text-sm font-bold text-slate-800">3.a) Vivienda</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tipo de Inmueble */}
        <div className="flex flex-col gap-1.5 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
          <label htmlFor="housing-type-select" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tipo de Inmueble</span>
          </label>
          <select
            id="housing-type-select"
            value={housingType}
            onChange={(e) => onUpdateHousing(e.target.value as HousingType)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          >
            <option value="Casa">Casa</option>
            <option value="Departamento">Departamento</option>
            <option value="Pieza en inquilinato / Pensión">Pieza en inquilinato / Pensión</option>
            <option value="Casilla / Rancho">Casilla / Rancho</option>
            <option value="Otro">Otro tipo</option>
          </select>
          <p className="text-[10px] text-slate-400">Características de la unidad habitacional.</p>
        </div>

        {/* Calidad del Ocupante */}
        <div className="flex flex-col gap-1.5 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
          <label htmlFor="occupancy-status-select" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            <span>Calidad u Ocupación del Ocupante</span>
          </label>
          <select
            id="occupancy-status-select"
            value={occupancyStatus}
            onChange={(e) => {
              const newStatus = e.target.value as OccupancyStatus;
              onUpdateOccupancy(newStatus);
              if (newStatus !== "Inquilino") {
                onUpdateMontoAlquiler(0);
              }
            }}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          >
            <option value="Inquilino">Inquilino (Alquila)</option>
            <option value="Propietario">Propietario</option>
            <option value="Ocupante gratuito">Ocupante gratuito (Prestado / Cedido)</option>
            <option value="Ocupante de hecho / Posesión">Ocupante de hecho / Posesión</option>
            <option value="Otro">Otro carácter</option>
          </select>
          <p className="text-[10px] text-slate-400">Régimen jurídico de ocupación.</p>
        </div>


      </div>

      {/* Conditionally rendered or highlighted Rent amount when Inquilino is selected */}
      {occupancyStatus === "Inquilino" && (
        <div className="animate-fade-in bg-amber-50/80 p-4 sm:p-5 rounded-2xl border border-amber-200 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label htmlFor="monto-alquiler-sec3" className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-amber-700" />
              <span>Monto Mensual del Alquiler (Canon Locativo)</span>
            </label>
            <span className="text-[10px] font-extrabold bg-amber-200/90 text-amber-900 px-2 py-0.5 rounded-md uppercase tracking-wider self-start sm:self-auto">
              Deducción Directa en Cálculo INA
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-700 text-sm font-bold">$</span>
              <input
                type="number"
                id="monto-alquiler-sec3"
                value={montoAlquiler === 0 ? "" : montoAlquiler}
                onChange={(e) => onUpdateMontoAlquiler(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-black text-amber-950 shadow-xs"
                placeholder="Ej. 350000"
              />
            </div>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Al declarar condición de <strong>Inquilino</strong>, este canon mensual se deduce de los ingresos familiares brutos junto con la Canasta Básica Total (CBT) del hogar y los gastos de salud.
            </p>
          </div>
        </div>
      )}
      </section>
      {/* Ask coverage before expenses without assuming that coverage eliminates medical costs. */}
      <section aria-labelledby="salud-heading" className="space-y-4 border-t border-slate-100 pt-4">
        <h4 id="salud-heading" className="text-sm font-bold text-slate-800">3.b) Salud</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
            <label htmlFor="obra-social-select" className="text-xs font-bold text-slate-700">¿Posee obra social?</label>
            <select id="obra-social-select" value={poseeObraSocial === undefined ? "" : poseeObraSocial ? "si" : "no"}
              onChange={event => onUpdateObraSocial(event.target.value === "" ? undefined : event.target.value === "si")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800">
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        {/* Gastos de Salud indispensables */}
        <div className="flex flex-col gap-1.5 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70">
          <label htmlFor="gastos-salud-sec3" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
            <span>Gastos Médicos Crónicos ($)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">$</span>
            <input
              type="number"
              id="gastos-salud-sec3"
              value={gastosSalud === 0 ? "" : gastosSalud}
              onChange={(e) => onUpdateGastosSalud(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))}
              className="w-full pl-7 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono font-semibold text-slate-800 shadow-2xs"
              placeholder="0"
            />
          </div>
          <p className="text-[10px] text-slate-400">Medicación crónica, pañales o tratamientos no cubiertos.</p>
        </div>
        </div>
      </section>
    </div>
  );
}
