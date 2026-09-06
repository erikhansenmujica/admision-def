/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { EvaluationInput, EvaluationResult, EconomicParams, JudicialLevel } from "../types";
import { formatCurrency, calculateCrianzaValue, getChildEquivalentCoefficient } from "../utils";
import { FileText, Printer, Shield, Scale, Clock, Check } from "lucide-react";

interface Props {
  input: EvaluationInput;
  result: EvaluationResult;
  params: EconomicParams;
}

export default function ActaDocument({ input, result, params }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    if (!printContent) return;

    const originalContent = document.body.innerHTML;

    // Create a temporary style element to inject print overrides
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body {
          background: white !important;
          color: black !important;
          padding: 1.5cm !important;
          font-family: 'Times New Roman', Times, serif !important;
          font-size: 12pt !important;
        }
        .no-print {
          display: none !important;
        }
        .print-shadow-none {
          box-shadow: none !important;
          border: 1px solid black !important;
        }
        .signature-line {
          border-top: 1px solid black !important;
        }
        @page {
          size: A4;
          margin: 2cm;
        }
      }
    `;
    document.head.appendChild(style);

    // Open clean window for print to avoid messing up current app state
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Acta de Evaluación Judicial - Necochea</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              body {
                font-family: 'Times New Roman', Georgia, serif;
                padding: 40px;
                background: white;
                color: black;
              }
              .border-double-custom {
                border: 4px double #1e293b;
              }
              @media print {
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      // Fallback
      window.print();
    }
  };

  const todayStr = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());

  const getAdmissibilityVerdict = (level: JudicialLevel) => {
    switch (level) {
      case JudicialLevel.VERDE:
        return "ADMISIBLE - DERIVACIÓN A DEFENSORÍA OFICIAL";
      case JudicialLevel.AMARILLO:
        return "EVALUACIÓN EXCEPCIONAL - LISTADO INTERMEDIO / HONORARIOS DIFERIDOS";
      case JudicialLevel.ROJO:
        return "NO ADMISIBLE - DERIVACIÓN A PATROCINIO PARTICULAR / COLEGIO DE ABOGADOS";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm" id="acta-document-container">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> Acta Oficial de Admisión (Cláusula 7ª)
          </h3>
          <p className="text-xs text-slate-500">Documento oficial de evaluación judicial enmarcado en el Convenio de Necochea.</p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          id="print-acta-btn"
        >
          <Printer className="w-4 h-4" /> Imprimir / Exportar Acta (PDF)
        </button>
      </div>

      {/* CERTIFICATE PREVIEW CARD */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 overflow-x-auto" id="acta-preview-wrapper">
        <div
          ref={printRef}
          className="min-w-[650px] max-w-[800px] mx-auto bg-white p-8 border-4 border-double border-slate-800 text-slate-900 shadow-lg text-sm"
          style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          id="acta-printable-content"
        >
          {/* Institution Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
            <span className="block text-xs font-bold uppercase tracking-widest text-slate-700">Poder Judicial de la Provincia de Buenos Aires</span>
            <span className="block text-base font-extrabold uppercase tracking-wide text-slate-900 mt-1">Departamento Judicial Necochea</span>
            <span className="block text-xs italic text-slate-500 mt-0.5">Convenio Marco de Admisión y Asistencia Jurídica Gratuita (Pautas Cláusula Séptima)</span>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h4 className="text-lg font-bold uppercase tracking-normal underline decoration-slate-800 decoration-1 underline-offset-4 font-serif">
              Acta de Evaluación de Admisión Judicial
            </h4>
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 mt-2 font-sans">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Generado: {todayStr}</span>
            </div>
          </div>

          {/* Datos de Identificación de Carpeta y de la Consulta */}
          <div className="mb-6 border border-slate-300 p-4 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <span className="font-bold text-[9px] text-slate-500 uppercase block">Nº de Carpeta SIMP:</span>
                {/* Never invent an official case identifier for a report. */}
                <span className="font-bold text-slate-900 text-sm font-mono">{input.nroCarpetaSimp || "Sin especificar"}</span>
              </div>
              <div>
                <span className="font-bold text-[9px] text-slate-500 uppercase block">Fecha de Evaluación:</span>
                <span className="font-bold text-slate-900 text-sm font-mono">{input.fechaConsulta || todayStr}</span>
              </div>
            </div>

            {/* Materia y Tipo de Trámite */}
            <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
              <div>
                <span className="font-bold text-[9px] text-slate-500 uppercase block">Materia / Tipo de Trámite:</span>
                <span className="font-bold text-indigo-950 text-xs block">{result.tramiteNombre}</span>
                <span className="text-[10px] text-slate-500 italic block mt-0.5">
                  Régimen: {result.isMateriaReservada ? "Materia Reservada Exclusiva MPD (Atención Indelegable)" : result.isRangoAmpliado ? "Rango Ampliado Capacidad (3-4 SMVM)" : result.isTopeDivorcio ? "Tope Diferenciado Divorcio (1.5-2 SMVM)" : result.isTopeSucesion ? "Tope Diferenciado Sucesión Social (1.5 SMVM)" : "Régimen General (2-3 SMVM)"}
                </span>
              </div>
              <div>
                <span className="font-bold text-[9px] text-slate-500 uppercase block">Objeto / Observaciones:</span>
                <span className="text-slate-800 text-xs block">{input.tramiteDetalle || "Trámite de asistencia jurídica y patrocinio oficial"}</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-200 text-[10px] text-slate-500 italic font-sans flex items-center gap-1.5">
              <span>🛡️ Documento disasociado de datos sensibles (Ley 25.326). La identidad se preserva bajo el número de trámite SIMP.</span>
            </div>
          </div>

          {/* Body Statement */}
          <p className="leading-relaxed text-justify mb-5 text-[13px]">
            En la ciudad de Necochea, en la fecha y hora indicadas en el encabezado, en los términos de la <strong>Cláusula Séptima</strong> del Convenio de Colaboración recíproca vigente y lo estipulado por el <strong>Art. 78 del Código de Procedimiento Civil y Comercial (CPCC PBA)</strong>, se labra la presente acta de evaluación técnico-social para la tramitación de la <strong>Carpeta SIMP N° {input.nroCarpetaSimp || "en trámite"}</strong>, a fin de determinar la viabilidad del Beneficio de Litigar sin Gastos (o en su defecto, la asistencia directa de la Defensoría Oficial).
          </p>

          {/* Include the recorded health coverage in the printable case. */}
          <p>¿Posee obra social?: {input.poseeObraSocial === undefined ? "Sin informar" : input.poseeObraSocial ? "Sí" : "No"}</p>
          {/* Section 1: Postulant Data */}
          <div className="mb-5">
            {/* Carry the economic reference periods into the printed report. */}
          <p>Origen de parámetros: {params.provenance?.mode === 'official' ? 'Datos oficiales' : 'Ingreso manual / histórico'}.
            {Object.entries(params.provenance?.indicators || {}).map(([key, item]) => <span key={key}> {key.toUpperCase()}: {item.period}.</span>)}
          </p>
          <h5 className="font-bold text-xs uppercase bg-slate-100 px-2 py-1 border-l-2 border-slate-800 mb-2.5 font-sans">
              1. Parámetros Económicos Generales de Referencia
            </h5>
            <table className="w-full text-xs border border-slate-300 border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50 w-1/2">Salario Mínimo Vital y Móvil (SMVM):</td>
                  <td className="p-2 font-mono">{formatCurrency(params.smvm)}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50">Límite Base Verde (2 SMVM):</td>
                  <td className="p-2 font-mono">{formatCurrency(params.smvm * 2)}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-50">Límite Base Amarillo (3 SMVM):</td>
                  <td className="p-2 font-mono">{formatCurrency(params.smvm * 3)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2: Financial Calculation */}
          <div className="mb-5">
            <h5 className="font-bold text-xs uppercase bg-slate-100 px-2 py-1 border-l-2 border-slate-800 mb-2.5 font-sans">
              2. Declaración Jurada de Ingresos y Egresos Familiares
            </h5>
            <table className="w-full text-xs border border-slate-300 border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50 w-1/2">Ingreso Bruto Mensual Declarado (Hogar):</td>
                  <td className="p-2 font-mono">{formatCurrency(input.ingresoBruto)}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50">Canasta Básica Total del Hogar (CBT):</td>
                  <td className="p-2 font-mono text-indigo-800 font-semibold">
                    {formatCurrency(result.cbtTotal)} <span className="text-[10px] text-slate-500 font-normal">({result.adeqTotal} Adultos Equivalentes)</span>
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50">Canasta Básica Alimentaria del Hogar (CBA):</td>
                  <td className="p-2 font-mono text-emerald-800 font-semibold">{formatCurrency(result.cbaTotal)}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50">Gastos de Salud Crónicos / Indispensables:</td>
                  <td className="p-2 font-mono text-rose-800 font-semibold">{formatCurrency(input.gastosSalud)}</td>
                </tr>
                {input.occupancyStatus === "Inquilino" && (input.montoAlquiler ?? 0) > 0 && (
                  <tr className="border-b border-slate-200 bg-amber-50/40">
                    <td className="p-2 font-bold text-amber-950">Gasto de Alquiler Mensual (Canon Locativo):</td>
                    <td className="p-2 font-mono text-rose-800 font-bold">-{formatCurrency(input.montoAlquiler || 0)}</td>
                  </tr>
                )}
                <tr className="bg-slate-100 font-bold">
                  <td className="p-2">Ingreso Neto Ajustado (INA Resultante):</td>
                  <td className="p-2 font-mono text-slate-900 underline decoration-slate-800 underline-offset-2">
                    {formatCurrency(result.ina)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Detailed household and housing composition */}
            <div className="mt-4">
              <h5 className="font-bold text-[11px] uppercase tracking-wide text-slate-700 mb-2 font-sans">
                Detalle del Grupo Familiar y Condiciones de Habitabilidad:
              </h5>
              <div className="border border-slate-300 rounded p-3 bg-slate-50 space-y-3 text-xs">
                {/* Housing & Tenure */}
                <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-200">
                  <div>
                    <span className="font-bold text-[10px] text-slate-500 uppercase block">Tipo de Vivienda:</span>
                    <span className="font-semibold text-slate-800">{input.housingType || "Casa"}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[10px] text-slate-500 uppercase block">Carácter de Ocupación:</span>
                    <span className="font-semibold text-slate-800">
                      {input.occupancyStatus || "Inquilino"}
                      {input.occupancyStatus === "Inquilino" && (input.montoAlquiler ?? 0) > 0 ? ` (Alquiler: ${formatCurrency(input.montoAlquiler || 0)}/mes)` : ""}
                    </span>
                  </div>
                </div>

                {/* Sub-item a: Menores a Cargo */}
                {input.children && input.children.length > 0 && (
                  <div>
                    <span className="font-bold text-[10px] text-slate-600 uppercase block mb-1">
                      a) Menores a Cargo (CBT INDEC, AUH y Cuota Alimentaria):
                    </span>
                    <div className="space-y-1.5">
                      {input.children.map((child, idx) => {
                        const coef = getChildEquivalentCoefficient(child.ageBracket);
                        const label = child.age ? `${child.age} años (${child.ageBracket})` : child.ageBracket;
                        const cbtVal = calculateCrianzaValue(child.ageBracket, params);
                        const auhText = child.percibeAUH ? ` • AUH: ${formatCurrency(child.montoAUH || 0)}` : "";
                        const cuotaText = child.percibeCuotaAlimentaria ? ` • Cuota Alim.: ${formatCurrency(child.montoCuotaAlimentaria || 0)}` : "";
                        return (
                          <div key={child.id} className="flex justify-between items-center text-[11px] bg-white px-2.5 py-1.5 border border-slate-200 rounded">
                            <span>
                              <strong>{child.name || `Menor ${idx + 1}`}</strong> ({label}, {child.sex}) [Eq. INDEC: {coef}]
                              <span className="text-emerald-700 font-semibold">{auhText}{cuotaText}</span>
                            </span>
                            <span className="font-mono font-semibold text-indigo-700">CBT INDEC: {formatCurrency(cbtVal)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sub-item b: Menores con Discapacidad */}
                {input.disabledMinors && input.disabledMinors.length > 0 && (
                  <div>
                    <span className="font-bold text-[10px] text-purple-700 uppercase block mb-1">
                      b) Menores con Discapacidad a Cargo:
                    </span>
                    <div className="space-y-1.5">
                      {input.disabledMinors.map((minor, idx) => (
                        <div key={minor.id} className="text-[11px] bg-white px-2.5 py-1.5 border border-purple-200 rounded text-purple-900 font-medium">
                          <strong>{minor.name || `Menor ${idx + 1}`}</strong> ({minor.age} años) - CUD: {minor.hasCUD ? "Sí (Vigente)" : "En trámite"} | Diagnóstico: {minor.diagnosis || "Sin especificar"}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-item c: Otros Adultos Convivientes (< 60 años) */}
                {input.adults && input.adults.length > 0 && (
                  <div>
                    <span className="font-bold text-[10px] text-slate-600 uppercase block mb-1">
                      c) Adultos Convivientes Menores a 60 años:
                    </span>
                    <div className="space-y-1.5">
                      {input.adults.filter(a => (a.age || 0) < 60).map((adult, idx) => (
                        <div key={adult.id} className="flex justify-between items-center text-[11px] bg-white px-2.5 py-1.5 border border-slate-200 rounded">
                          <span>
                            <strong>{adult.name || `Adulto ${idx + 1}`}</strong> ({adult.relationship || "Conviviente"}, {adult.age} años) - Laboral: {adult.jobType}
                          </span>
                          <span className="font-mono font-bold text-slate-800">Ingresos: {formatCurrency(adult.monthlyIncome)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-item d: Adultos con Discapacidad */}
                {input.disabledAdults && input.disabledAdults.length > 0 && (
                  <div>
                    <span className="font-bold text-[10px] text-indigo-700 uppercase block mb-1">
                      d) Adultos con Discapacidad a Cargo:
                    </span>
                    <div className="space-y-1.5">
                      {input.disabledAdults.map((adult, idx) => (
                        <div key={adult.id} className="text-[11px] bg-white px-2.5 py-1.5 border border-indigo-200 rounded text-indigo-950 font-medium">
                          <strong>{adult.name || `Adulto ${idx + 1}`}</strong> ({adult.relationship || "Familiar"}, {adult.age} años) - CUD: {adult.hasCUD ? "Sí" : "En trámite"} | Diagnóstico: {adult.diagnosis || "Sin especificar"}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-item e: Adultos Mayores (>= 60 años) */}
                {input.adults && input.adults.some(a => (a.age || 0) >= 60) && (
                  <div>
                    <span className="font-bold text-[10px] text-amber-800 uppercase block mb-1">
                      e) Adultos Mayores a 60 años Convivientes:
                    </span>
                    <div className="space-y-1.5">
                      {input.adults.filter(a => (a.age || 0) >= 60).map((adult, idx) => (
                        <div key={adult.id} className="flex justify-between items-center text-[11px] bg-white px-2.5 py-1.5 border border-amber-200 rounded">
                          <span>
                            <strong>{adult.name || `Adulto Mayor ${idx + 1}`}</strong> ({adult.relationship || "Adulto Mayor"}, {adult.age} años) - Beneficio: {adult.isPensioner !== false ? adult.pensionType || "Jubilación/Pensión" : "Sin haber previsional"}
                          </span>
                          <span className="font-mono font-bold text-amber-900">Haber mensual: {formatCurrency(adult.monthlyIncome)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Social Vulnerability Index */}
          <div className="mb-5">
            <h5 className="font-bold text-xs uppercase bg-slate-100 px-2 py-1 border-l-2 border-slate-800 mb-2.5 font-sans">
              3. Índice de Vulnerabilidad Social (IVS Calculated)
            </h5>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span>Puntaje Total Otorgado:</span>
                <span className="font-bold font-mono">{result.ivsScore} / 8 pts</span>
              </div>
              <div className="border border-slate-200 p-2.5 rounded text-[11px] space-y-1 bg-slate-50">
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${input.vulnerabilities.violenciaGenero ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-400"}`}>
                    {input.vulnerabilities.violenciaGenero ? <Check className="w-2.5 h-2.5" /> : ""}
                  </span>
                  <span className={input.vulnerabilities.violenciaGenero ? "font-bold" : "text-slate-500"}>Situación de Violencia de Género / Familiar (+3 pts)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${input.vulnerabilities.discapacidad ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-400"}`}>
                    {input.vulnerabilities.discapacidad ? <Check className="w-2.5 h-2.5" /> : ""}
                  </span>
                  <span className={input.vulnerabilities.discapacidad ? "font-bold" : "text-slate-500"}>Integrante con Discapacidad Certificada (CUD) (+2 pts)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${input.vulnerabilities.hogarMonoparental ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-400"}`}>
                    {input.vulnerabilities.hogarMonoparental ? <Check className="w-2.5 h-2.5" /> : ""}
                  </span>
                  <span className={input.vulnerabilities.hogarMonoparental ? "font-bold" : "text-slate-500"}>Hogar Monoparental o Adulto Mayor a Cargo (+2 pts)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${input.vulnerabilities.enfermedadTrabajoInformal ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-400"}`}>
                    {input.vulnerabilities.enfermedadTrabajoInformal ? <Check className="w-2.5 h-2.5" /> : ""}
                  </span>
                  <span className={input.vulnerabilities.enfermedadTrabajoInformal ? "font-bold" : "text-slate-500"}>Enfermedad Compleja / Trabajo Informal Precarizado (+1 pt)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Resolution Dictamen */}
          <div className="mb-6 border-2 border-slate-800 p-4 rounded-lg bg-slate-50/50">
            <h5 className="font-extrabold text-xs uppercase text-slate-900 border-b border-slate-300 pb-1.5 mb-2.5 font-sans">
              4. Dictamen de Admisión / Resolución del Evaluador
            </h5>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-700 block">NIVEL DETERMINADO:</span>
                <span className="text-sm font-extrabold text-slate-900 tracking-tight font-sans block mt-0.5">
                  {getAdmissibilityVerdict(result.finalLevel)}
                </span>
              </div>
              <div className="mt-2.5">
                <span className="font-bold text-slate-700 block">JUSTIFICACIÓN TÉCNICA REGLADA:</span>
                <p className="text-[12px] text-justify leading-relaxed text-slate-800 italic mt-1 bg-white p-3 border border-slate-200 rounded">
                  "{result.reclassificationReason}"
                </p>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-500 text-justify border-t border-slate-200 pt-2.5 mt-2.5">
                <strong>Cláusula de Garantía de Alimentos:</strong> En cumplimiento de las pautas de admisión unificadas, se ha priorizado la protección del carácter alimentario del ingreso familiar. Se ratifica que las expensas indispensables para la subsistencia y crianza de los hijos (calculadas mediante las equivalencias de la Canasta Básica Total del INDEC por tramo de edad) y los gastos médicos indispensables no deben competir bajo ningún aspecto con el costo de las tasas y honorarios del proceso judicial, según doctrina uniforme del tribunal supremo provincial.
              </p>
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="mt-14 pt-10 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-[11px] font-sans">
            <div>
              <div className="h-0.5 bg-slate-400 mx-auto w-3/4 mb-1.5" />
              <span className="block font-bold text-slate-800">Evaluador / Letrado</span>
              <span className="block text-slate-500 text-[10px]">Departamento Judicial Necochea</span>
            </div>
            <div>
              <div className="h-0.5 bg-slate-400 mx-auto w-3/4 mb-1.5" />
              <span className="block font-bold text-slate-800">Defensoría Oficial / Delegado</span>
              <span className="block text-slate-500 text-[10px]">Poder Judicial PBA</span>
            </div>
            <div>
              <div className="h-0.5 bg-slate-400 mx-auto w-3/4 mb-1.5" />
              <span className="block font-bold text-slate-800">Firma del Postulante</span>
              <span className="block text-slate-500 text-[10px]">Declarante bajo Juramento</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
