/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum JudicialLevel {
  VERDE = "VERDE",      // Defensoría Oficial
  AMARILLO = "AMARILLO",  // Evaluación Excepcional / Listado Intermedio
  ROJO = "ROJO"         // Colegio de Abogados (Patrocinio Particular)
}

// Store the publication periods and provenance alongside monetary inputs.
export interface EconomicParams {
  provenance?: { mode: 'official' | 'manual'; fetchedAt?: string; indicators?: Record<string, { value: number; period: string; source: string; url: string }> };
  smvm: number; // Salario Mínimo Vital y Móvil
  cba: number;  // Canasta Básica Alimentaria base por adulto equivalente
  cbt: number;  // Canasta Básica Total base por adulto equivalente
  adultsCount: number; // Cantidad de adultos en el hogar (default: 1)
}

export interface Adult {
  id: string;
  name: string;
  relationship?: string; // e.g. "Titular", "Cónyuge / Pareja", "Hijo/a mayor", "Hermano/a", "Padre/Madre", "Otro"
  age: number;
  sex: "Masculino" | "Femenino" | "Otro";
  jobType: "Formal" | "Informal" | "Desocupado / Sin ingresos" | "Jubilado / Pensionado";
  educationLevel?: "Primario Incompleto" | "Primario Completo" | "Secundario Incompleto" | "Secundario Completo" | "Superior Incompleto" | "Superior Completo";
  monthlyIncome: number;
  isPensioner?: boolean; // Para adultos mayores >= 60 años
  pensionType?: string;  // e.g. "Jubilación", "Pensión", "PUAM", "PNC", "Sin beneficio"
}

export interface Child {
  id: string;
  name: string;
  age?: number;
  ageBracket: "under1" | "1to3" | "4to5" | "6to12" | "13to18";
  sex: "Masculino" | "Femenino" | "Otro";
  percibeAUH?: boolean; // Asignación Universal por Hijo
  montoAUH?: number;
  percibeCuotaAlimentaria?: boolean; // Cuota alimentaria
  montoCuotaAlimentaria?: number;
}

export interface DisabledMinor {
  id: string;
  name: string;
  age: number;
  ageBracket: "under1" | "1to3" | "4to5" | "6to12" | "13to18";
  sex: "Masculino" | "Femenino" | "Otro";
  hasCUD: boolean; // Certificado Único de Discapacidad
  diagnosis: string;
}

export interface DisabledAdult {
  id: string;
  name: string;
  relationship?: string;
  age: number;
  sex: "Masculino" | "Femenino" | "Otro";
  hasCUD: boolean;
  diagnosis: string;
  monthlyIncome?: number;
}

export interface DisabledPerson {
  id: string;
  name: string;
  category: "Adulto Mayor" | "Adulto" | "Niño/Niña" | "Adolescente";
  age?: number;
  diagnosis?: string;
  hasCUD?: boolean;
}

export type HousingType = "Casa" | "Departamento" | "Pieza en inquilinato / Pensión" | "Casilla / Rancho" | "Otro";
export type OccupancyStatus = "Propietario" | "Inquilino" | "Ocupante gratuito" | "Ocupante de hecho / Posesión" | "Otro";

export type TramiteCategory = 
  | "reservada"               // Materias Reservadas a la Defensoría Oficial (Exclusivas e Indelegables)
  | "determinacion_capacidad"  // Determinación de la Capacidad Jurídica / Salud Mental (Rango ampliado 3-4 SMVM)
  | "divorcio"                 // Divorcio (Situación Especial - Tope 1.5 SMVM y derivación por regla)
  | "sucesion_excepcional"     // Sucesión (Situación Especial - Fundamento social grave, tope 1.5 SMVM)
  | "amparos"                  // Amparos de Salud (Diferencial PROFE / Pensiones No Contributivas vs General)
  | "danos_perjuicios"         // Daños y Perjuicios (Diferencial Cuestión Penal / Personas Privadas de Libertad)
  | "general";                 // Materias Ordinarias de Familia y Civil (Régimen General 2 SMVM)

export interface TramiteDefinition {
  id: string;
  category: TramiteCategory;
  name: string;
  shortName: string;
  legalBasis: string;
  description: string;
  economicRule: string;
  multiplierVerde: number; // Multiplicador de SMVM para Verde (ej: 2 general, 3 capacidad, 1.5 divorcio/sucesión, Infinity reservada)
  multiplierAmarillo: number; // Multiplicador de SMVM para Amarillo (ej: 3 general, 4 capacidad, 2 divorcio/sucesión, Infinity reservada)
  isExclusivelyReserved?: boolean;
}

export interface VulnerabilityFactors {
  violenciaGenero: boolean; // +3 pts
  discapacidad: boolean;    // +2 pts
  hogarMonoparental: boolean; // +2 pts
  enfermedadTrabajoInformal: boolean; // +1 pt
}

export interface EvaluationInput {
  nroCarpetaSimp?: string;
  fechaConsulta?: string;
  tramiteCategoria?: TramiteCategory;
  tramiteTipo?: string; // id del trámite
  tramiteDetalle?: string;
  ingresoBruto: number;
  gastosSalud: number;
  montoAlquiler?: number; // Canon de alquiler mensual cuando la vivienda es alquilada
  adults: Adult[];
  children: Child[];
  disabledPersons: DisabledPerson[];
  disabledMinors?: DisabledMinor[];
  disabledAdults?: DisabledAdult[];
  housingType: HousingType;
  occupancyStatus: OccupancyStatus;
  vulnerabilities: VulnerabilityFactors;
}

export interface EvaluationResult {
  tramiteCategoria: TramiteCategory;
  tramiteTipo: string;
  tramiteNombre: string;
  isMateriaReservada: boolean;
  isRangoAmpliado: boolean;
  isTopeDivorcio: boolean;
  isTopeSucesion?: boolean;
  isDanosPerjuiciosPenal?: boolean;
  isAmparoProfe?: boolean;
  threshold2SMVM: number; // Umbral efectivo para Nivel Verde
  threshold3SMVM: number; // Umbral efectivo para Nivel Amarillo
  adeqTotal: number; // Total de adultos equivalentes del hogar
  cbaTotal: number;  // Valor de la Canasta Básica Alimentaria del hogar
  cbtTotal: number;  // Valor de la Canasta Básica Total del hogar
  ina: number;
  ivsScore: number;
  baseLevel: JudicialLevel;
  finalLevel: JudicialLevel;
  reclassificationReason: string;
  isShifted: boolean;
  shiftDirection: "up" | "down" | "none"; // 'up' means shifted towards more protective (Rojo -> Amarillo or Amarillo -> Verde)
}

export interface SavedEvaluation {
  id: string;
  dateStr: string; // ISO string or formatted date
  caseNumber: string; // e.g. #NC-2026-4492-ADM
  nroCarpetaSimp: string; // e.g. "SIMP-12-00-004521-26"
  input: EvaluationInput;
  result: EvaluationResult;
  params: EconomicParams;
}
