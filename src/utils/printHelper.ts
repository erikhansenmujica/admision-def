/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SavedEvaluation, JudicialLevel } from "../types";
import { formatCurrency, calculateCrianzaValue, getChildEquivalentCoefficient } from "../utils";

export function printSavedEvaluationActa(savedCase: SavedEvaluation) {
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

  const membersHtml = `
    <div style="margin-top: 15px; margin-bottom: 15px; font-family: system-ui, -apple-system, sans-serif; font-size: 11px;">
      <span style="display: block; font-size: 12px; font-weight: bold; color: #1e293b; margin-bottom: 6px;">Detalle del Grupo Familiar y Condiciones de Habitabilidad:</span>
      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; background-color: #f8fafc; display: flex; flex-direction: column; gap: 10px;">
        
        <!-- Housing and Tenancy -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">
          <div>
            <span style="font-weight: bold; color: #64748b; font-size: 9px; text-transform: uppercase; display: block;">Tipo de Vivienda:</span>
            <span style="font-weight: 600; color: #0f172a; font-size: 11px;">${savedCase.input.housingType || "Casa"}</span>
          </div>
          <div>
            <span style="font-weight: bold; color: #64748b; font-size: 9px; text-transform: uppercase; display: block;">Carácter de Ocupación:</span>
            <span style="font-weight: 600; color: #0f172a; font-size: 11px;">
              ${savedCase.input.occupancyStatus || "Inquilino"}
              ${savedCase.input.occupancyStatus === "Inquilino" && (savedCase.input.montoAlquiler ?? 0) > 0 ? ` (Alquiler: ${formatCurrency(savedCase.input.montoAlquiler || 0)}/mes)` : ""}
            </span>
          </div>
        </div>

        <!-- 2.a) Menores a Cargo -->
        <div>
          <span style="font-weight: bold; color: #475569; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 4px;">a) Menores a Cargo (CBT INDEC, AUH y Cuota Alimentaria):</span>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${savedCase.input.children && savedCase.input.children.length > 0 
              ? savedCase.input.children.map((child, idx) => {
                  const coef = getChildEquivalentCoefficient(child.ageBracket);
                  const label = child.age ? `${child.age} años (${child.ageBracket})` : child.ageBracket;
                  const auhText = child.percibeAUH ? ` • AUH: ${formatCurrency(child.montoAUH || 0)}` : "";
                  const cuotaText = child.percibeCuotaAlimentaria ? ` • Cuota: ${formatCurrency(child.montoCuotaAlimentaria || 0)}` : "";
                  return `
                    <div style="display: flex; justify-content: space-between; background-color: white; padding: 4px 8px; border: 1px solid #e2e8f0; border-radius: 4px;">
                      <span><strong>${child.name || `Menor ${idx + 1}`}</strong> (${label}, ${child.sex || "Femenino"}) [Eq. INDEC: ${coef}] <span style="color: #047857; font-weight: bold;">${auhText}${cuotaText}</span></span>
                      <span style="font-family: monospace; font-weight: bold; color: #4338ca;">CBT INDEC: ${formatCurrency(calculateCrianzaValue(child.ageBracket, savedCase.params))}</span>
                    </div>
                  `;
                }).join('')
              : `<span style="font-style: italic; color: #64748b;">Ningún menor registrado.</span>`
            }
          </div>
        </div>

        <!-- 2.b) Menores con Discapacidad -->
        ${savedCase.input.disabledMinors && savedCase.input.disabledMinors.length > 0 ? `
          <div>
            <span style="font-weight: bold; color: #7e22ce; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 4px;">b) Menores con Discapacidad a Cargo:</span>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              ${savedCase.input.disabledMinors.map((minor, idx) => `
                <div style="background-color: white; padding: 4px 8px; border: 1px solid #e9d5ff; border-radius: 4px; color: #581c87;">
                  <strong>${minor.name || `Menor ${idx + 1}`}</strong> (${minor.age} años) - CUD: ${minor.hasCUD ? "Sí (Vigente)" : "En trámite"} | Diagnóstico: ${minor.diagnosis || "Sin especificar"}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 2.c) Adultos Convivientes < 60 -->
        <div>
          <span style="font-weight: bold; color: #475569; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 4px;">c) Adultos Convivientes Menores a 60 años:</span>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${savedCase.input.adults && savedCase.input.adults.filter(a => (a.age || 0) < 60).length > 0 
              ? savedCase.input.adults.filter(a => (a.age || 0) < 60).map((adult, idx) => `
                  <div style="display: flex; justify-content: space-between; background-color: white; padding: 4px 8px; border: 1px solid #e2e8f0; border-radius: 4px;">
                    <span><strong>${adult.name || `Adulto ${idx + 1}`}</strong> (${adult.relationship || "Conviviente"}, ${adult.age} años) - Laboral: ${adult.jobType}</span>
                    <span style="font-family: monospace; font-weight: bold;">Ingresos: ${formatCurrency(adult.monthlyIncome)}</span>
                  </div>
                `).join('')
              : `<span style="font-style: italic; color: #64748b;">Ningún otro adulto menor a 60 años registrado.</span>`
            }
          </div>
        </div>

        <!-- 2.d) Adultos con Discapacidad -->
        ${savedCase.input.disabledAdults && savedCase.input.disabledAdults.length > 0 ? `
          <div>
            <span style="font-weight: bold; color: #4338ca; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 4px;">d) Adultos con Discapacidad a Cargo:</span>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              ${savedCase.input.disabledAdults.map((adult, idx) => `
                <div style="background-color: white; padding: 4px 8px; border: 1px solid #c7d2fe; border-radius: 4px; color: #312e81;">
                  <strong>${adult.name || `Adulto ${idx + 1}`}</strong> (${adult.relationship || "Familiar"}, ${adult.age} años) - CUD: ${adult.hasCUD ? "Sí" : "En trámite"} | Diagnóstico: ${adult.diagnosis || "Sin especificar"}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 2.e) Adultos Mayores >= 60 -->
        ${savedCase.input.adults && savedCase.input.adults.some(a => (a.age || 0) >= 60) ? `
          <div>
            <span style="font-weight: bold; color: #92400e; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 4px;">e) Adultos Mayores a 60 años Convivientes:</span>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              ${savedCase.input.adults.filter(a => (a.age || 0) >= 60).map((adult, idx) => `
                <div style="display: flex; justify-content: space-between; background-color: white; padding: 4px 8px; border: 1px solid #fde68a; border-radius: 4px;">
                  <span><strong>${adult.name || `Adulto Mayor ${idx + 1}`}</strong> (${adult.relationship || "Adulto Mayor"}, ${adult.age} años) - Previsión: ${adult.isPensioner !== false ? adult.pensionType || "Jubilación/Pensión" : "Sin haber"}</span>
                  <span style="font-family: monospace; font-weight: bold; color: #78350f;">Haber mensual: ${formatCurrency(adult.monthlyIncome)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    </div>
  `;

  const htmlContent = `
    <div style="font-family: 'Times New Roman', Georgia, serif; max-width: 800px; margin: 0 auto; color: #0f172a; line-height: 1.5; font-size: 13px;" id="acta-printable-content">
      <!-- Institution Header -->
      <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px;">
        <span style="display: block; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #475569; font-family: system-ui, sans-serif;">Poder Judicial de la Provincia de Buenos Aires</span>
        <span style="display: block; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #0f172a; margin-top: 4px; font-family: system-ui, sans-serif;">Departamento Judicial Necochea</span>
        <span style="display: block; font-size: 11px; font-style: italic; color: #64748b; margin-top: 2px;">Convenio Marco de Admisión y Asistencia Jurídica Gratuita (Pautas Cláusula Séptima)</span>
      </div>

      <!-- Title -->
      <div style="text-align: center; margin-bottom: 24px;">
        <h4 style="font-size: 18px; font-weight: bold; text-transform: uppercase; text-decoration: underline; text-underline-offset: 4px; margin: 0;">
          Acta de Evaluación de Admisión Judicial
        </h4>
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 11px; color: #64748b; margin-top: 8px; font-family: system-ui, sans-serif; flex-wrap: wrap;">
          <span><strong>Nº Caso:</strong> ${savedCase.caseNumber}</span>
          <span>•</span>
          <span><strong>Carpeta SIMP:</strong> ${savedCase.nroCarpetaSimp || "En trámite"}</span>
          <span>•</span>
          <span><strong>Trámite:</strong> ${savedCase.result.tramiteNombre || "General / Familia"}</span>
          <span>•</span>
          <span><strong>Fecha de Registro:</strong> ${savedCase.dateStr}</span>
        </div>
        ${savedCase.input.tramiteDetalle ? `
          <div style="margin-top: 6px; font-size: 11px; color: #334155; font-style: italic; font-family: system-ui, sans-serif;">
            Objeto / Observaciones: ${savedCase.input.tramiteDetalle}
          </div>
        ` : ''}
      </div>

      <!-- Body Statement -->
      <p style="text-align: justify; margin-bottom: 20px; font-size: 13.5px;">
        En la ciudad de Necochea, en los términos de la <strong>Cláusula Séptima</strong> del Convenio de Colaboración recíproca vigente y lo estipulado por el <strong>Art. 78 del Código de Procedimiento Civil y Comercial (CPCC PBA)</strong>, se labra la presente acta de evaluación técnico-social para la tramitación de la <strong>Carpeta SIMP N° ${savedCase.nroCarpetaSimp || "en trámite"}</strong> (datos personales anonimizados de conformidad con la Ley 25.326), a fin de determinar la viabilidad del Beneficio de Litigar sin Gastos (o en su defecto, la asistencia directa de la Defensoría Oficial).
      </p>

      <!-- Section 1: Economic Parameters -->
      <div style="margin-bottom: 20px;">
        <h5 style="font-weight: bold; font-size: 12px; text-transform: uppercase; background-color: #f1f5f9; padding: 4px 8px; border-left: 3px solid #0f172a; margin-top: 0; margin-bottom: 10px; font-family: system-ui, sans-serif;">
          1. Parámetros Económicos Generales de Referencia
        </h5>
        <table style="width: 100%; font-size: 12px; border: 1px solid #cbd5e1; border-collapse: collapse;">
          <tbody>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px; font-weight: bold; background-color: #f8fafc; width: 50%;">Salario Mínimo Vital y Móvil (SMVM):</td>
              <td style="padding: 8px; font-family: monospace; font-weight: bold;">${formatCurrency(savedCase.params.smvm)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px; font-weight: bold; background-color: #f8fafc;">Límite Base Verde (2 SMVM):</td>
              <td style="padding: 8px; font-family: monospace; font-weight: bold;">${formatCurrency(savedCase.params.smvm * 2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; background-color: #f8fafc;">Límite Base Amarillo (3 SMVM):</td>
              <td style="padding: 8px; font-family: monospace; font-weight: bold;">${formatCurrency(savedCase.params.smvm * 3)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Section 2: Financial Calculation -->
      <div style="margin-bottom: 20px;">
        <h5 style="font-weight: bold; font-size: 12px; text-transform: uppercase; background-color: #f1f5f9; padding: 4px 8px; border-left: 3px solid #0f172a; margin-top: 0; margin-bottom: 10px; font-family: system-ui, sans-serif;">
          2. Declaración Jurada de Ingresos y Egresos Familiares
        </h5>
        <table style="width: 100%; font-size: 12px; border: 1px solid #cbd5e1; border-collapse: collapse;">
          <tbody>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px; font-weight: bold; background-color: #f8fafc; width: 50%;">Ingreso Bruto Mensual Declarado (Hogar):</td>
              <td style="padding: 8px; font-family: monospace; font-weight: bold;">${formatCurrency(savedCase.input.ingresoBruto)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px; font-weight: bold; background-color: #f8fafc;">Canasta Básica Total del Hogar (CBT):</td>
              <td style="padding: 8px; font-family: monospace; color: #4338ca; font-weight: bold;">
                ${formatCurrency(savedCase.result.cbtTotal)} <span style="font-size: 10px; font-weight: normal; color: #64748b;">(${savedCase.result.adeqTotal} Adultos Equivalentes)</span>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px; font-weight: bold; background-color: #f8fafc;">Canasta Básica Alimentaria del Hogar (CBA):</td>
              <td style="padding: 8px; font-family: monospace; color: #047857; font-weight: bold;">${formatCurrency(savedCase.result.cbaTotal)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px; font-weight: bold; background-color: #f8fafc;">Gastos de Salud Crónicos / Indispensables:</td>
              <td style="padding: 8px; font-family: monospace; color: #be123c; font-weight: bold;">${formatCurrency(savedCase.input.gastosSalud)}</td>
            </tr>
            ${savedCase.input.occupancyStatus === "Inquilino" && (savedCase.input.montoAlquiler ?? 0) > 0 ? `
              <tr style="border-bottom: 1px solid #e2e8f0; background-color: #fefce8;">
                <td style="padding: 8px; font-weight: bold; color: #78350f;">Gasto de Alquiler Mensual (Canon Locativo):</td>
                <td style="padding: 8px; font-family: monospace; color: #be123c; font-weight: bold;">-${formatCurrency(savedCase.input.montoAlquiler || 0)}</td>
              </tr>
            ` : ''}
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <td style="padding: 8px;">Ingreso Neto Ajustado (INA Resultante):</td>
              <td style="padding: 8px; font-family: monospace; text-decoration: underline; text-underline-offset: 2px;">
                ${formatCurrency(savedCase.result.ina)}
              </td>
            </tr>
          </tbody>
        </table>

        ${membersHtml}
      </div>

      <!-- Section 3: Social Vulnerability Index -->
      <div style="margin-bottom: 20px;">
        <h5 style="font-weight: bold; font-size: 12px; text-transform: uppercase; background-color: #f1f5f9; padding: 4px 8px; border-left: 3px solid #0f172a; margin-top: 0; margin-bottom: 10px; font-family: system-ui, sans-serif;">
          3. Índice de Vulnerabilidad Social (IVS)
        </h5>
        <div style="font-size: 12px; font-family: system-ui, sans-serif;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>Puntaje Total Otorgado:</span>
            <span style="font-weight: bold; font-family: monospace;">${savedCase.result.ivsScore} / 8 pts</span>
          </div>
          <div style="border: 1px solid #cbd5e1; padding: 10px; border-radius: 6px; background-color: #f8fafc; font-size: 11px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; color: ${savedCase.input.vulnerabilities.violenciaGenero ? '#0f172a' : '#64748b'}; font-weight: ${savedCase.input.vulnerabilities.violenciaGenero ? 'bold' : 'normal'};">
              <span>[${savedCase.input.vulnerabilities.violenciaGenero ? 'X' : ' '}]</span>
              <span>Situación de Violencia de Género / Familiar (+3 pts)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; color: ${savedCase.input.vulnerabilities.discapacidad ? '#0f172a' : '#64748b'}; font-weight: ${savedCase.input.vulnerabilities.discapacidad ? 'bold' : 'normal'};">
              <span>[${savedCase.input.vulnerabilities.discapacidad ? 'X' : ' '}]</span>
              <span>Integrante con Discapacidad Certificada (CUD) (+2 pts)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; color: ${savedCase.input.vulnerabilities.hogarMonoparental ? '#0f172a' : '#64748b'}; font-weight: ${savedCase.input.vulnerabilities.hogarMonoparental ? 'bold' : 'normal'};">
              <span>[${savedCase.input.vulnerabilities.hogarMonoparental ? 'X' : ' '}]</span>
              <span>Hogar Monoparental o Adulto Mayor a Cargo (+2 pts)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; color: ${savedCase.input.vulnerabilities.enfermedadTrabajoInformal ? '#0f172a' : '#64748b'}; font-weight: ${savedCase.input.vulnerabilities.enfermedadTrabajoInformal ? 'bold' : 'normal'};">
              <span>[${savedCase.input.vulnerabilities.enfermedadTrabajoInformal ? 'X' : ' '}]</span>
              <span>Enfermedad Compleja / Trabajo Informal Precarizado (+1 pt)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 4: Resolution Dictamen -->
      <div style="margin-bottom: 24px; border: 2px solid #0f172a; padding: 16px; border-radius: 8px; background-color: #f8fafc;">
        <h5 style="font-weight: 800; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-top: 0; margin-bottom: 10px; font-family: system-ui, sans-serif;">
          4. Dictamen de Admisión / Resolución del Evaluador
        </h5>
        <div style="font-size: 12px;">
          <div>
            <span style="font-weight: bold; color: #475569; display: block; font-family: system-ui, sans-serif;">NIVEL DETERMINADO:</span>
            <span style="font-size: 14px; font-weight: 800; color: #0f172a; display: block; margin-top: 2px; font-family: system-ui, sans-serif;">
              ${getAdmissibilityVerdict(savedCase.result.finalLevel)}
            </span>
          </div>
          <div style="margin-top: 10px;">
            <span style="font-weight: bold; color: #475569; display: block; font-family: system-ui, sans-serif;">JUSTIFICACIÓN TÉCNICA REGLADA:</span>
            <p style="font-style: italic; text-align: justify; color: #1e293b; background-color: #ffffff; padding: 10px; border: 1px solid #cbd5e1; border-radius: 4px; margin-top: 4px; margin-bottom: 0;">
              "${savedCase.result.reclassificationReason}"
            </p>
          </div>
          <p style="font-size: 10px; line-height: 1.4; color: #64748b; text-align: justify; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 10px; margin-bottom: 0;">
            <strong>Cláusula de Garantía de Alimentos:</strong> En cumplimiento de las pautas de admisión unificadas, se ha priorizado la protección del carácter alimentario del ingreso familiar. Se ratifica que las expensas indispensables para la subsistencia y crianza de los hijos (calculadas mediante las equivalencias de la Canasta Básica Total del INDEC por tramo de edad) y los gastos médicos indispensables no deben competir bajo ningún aspecto con el costo de las tasas y honorarios del proceso judicial, según doctrina uniforme del tribunal supremo provincial.
          </p>
        </div>
      </div>

      <!-- Signatures Footer -->
      <div style="margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; text-align: center; font-size: 11px; font-family: system-ui, sans-serif;">
        <div>
          <div style="height: 1px; background-color: #94a3b8; width: 80%; margin: 0 auto 6px auto;"></div>
          <span style="display: block; font-weight: bold; color: #334155;">Evaluador / Letrado</span>
          <span style="display: block; color: #64748b; font-size: 10px;">Dpto. Judicial Necochea</span>
        </div>
        <div>
          <div style="height: 1px; background-color: #94a3b8; width: 80%; margin: 0 auto 6px auto;"></div>
          <span style="display: block; font-weight: bold; color: #334155;">Defensoría Oficial</span>
          <span style="display: block; color: #64748b; font-size: 10px;">Poder Judicial PBA</span>
        </div>
        <div>
          <div style="height: 1px; background-color: #94a3b8; width: 80%; margin: 0 auto 6px auto;"></div>
          <span style="display: block; font-weight: bold; color: #334155;">Firma de Postulante</span>
          <span style="display: block; color: #64748b; font-size: 10px;">Declarante bajo Juramento</span>
        </div>
      </div>
    </div>
  `;

  // Open clean window for printing
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Acta de Admisión - Carpeta ${savedCase.nroCarpetaSimp || "SIMP"} (${savedCase.caseNumber})</title>
          <style>
            body {
              background: white;
              color: black;
              padding: 40px;
              font-family: 'Times New Roman', Times, serif;
            }
            @media print {
              body {
                padding: 1.5cm;
              }
              @page {
                size: A4;
                margin: 2cm;
              }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
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
    // Fallback alert is blocked in sandbox, so let's try standard alert or warning on DOM
    console.error("Popup window blocked. Could not open print preview.");
  }
}
