/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  EconomicParams, 
  EvaluationInput, 
  EvaluationResult, 
  JudicialLevel,
  TramiteCategory,
  TramiteDefinition
} from "./types";

// Zero means unavailable; the UI blocks evaluation until real or manually verified values exist.
export const DEFAULT_PARAMS: EconomicParams = { smvm: 0, cba: 0, cbt: 0, adultsCount: 1 };

export const TRAMITES_CATALOGUE: TramiteDefinition[] = [
  // =========================================================================
  // 1. MATERIAS RESERVADAS A LA DEFENSORÍA OFICIAL (Exclusivas e Indelegables)
  // =========================================================================
  {
    id: "res_delegacion_parental_guardas",
    category: "reservada",
    name: "Delegación de la responsabilidad parental. Guardas.",
    shortName: "Delegación Parental / Guardas",
    legalBasis: "Arts. 643 y 657 CCCN, Convenio de Derivación",
    description: "Delegación del ejercicio de la responsabilidad parental en parientes o terceros idóneos y guardas judiciales.",
    economicRule: "Materia Reservada a la Defensoría Oficial. Atención obligatoria e indelegable de la Defensa Pública sin sujeción a topes económicos restrictivos.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_medidas_abrigo",
    category: "reservada",
    name: "Medidas de Abrigo (Protección Integral de Niñez)",
    shortName: "Medidas de Abrigo",
    legalBasis: "Ley Pcial. 13.298, Ley Nac. 26.061, CDN",
    description: "Intervenciones urgentes de abrigo y protección de niñas, niños y adolescentes en situación de vulneración grave o desamparo.",
    economicRule: "Materia Reservada a la Defensoría Oficial. Intervención forzosa e indelegable del Ministerio Público de la Defensa.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_cuestiones_nombre",
    category: "reservada",
    name: "Cuestiones relacionadas con el Nombre",
    shortName: "Cuestiones del Nombre",
    legalBasis: "Arts. 62 a 72 CCCN, Ley 26.743",
    description: "Cambio, adición, supresión o rectificación de nombre, apellido o identidad registral de las personas.",
    economicRule: "Materia Reservada a la Defensoría Oficial. Admisión directa prioritaria.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_privacion_suspension_parental",
    category: "reservada",
    name: "Privación y Suspensión de Responsabilidad Parental",
    shortName: "Privación/Suspensión Parental",
    legalBasis: "Arts. 700 a 704 CCCN",
    description: "Acciones judiciales de privación, rehabilitación o suspensión del ejercicio de la responsabilidad parental.",
    economicRule: "Materia Reservada a la Defensoría Oficial. Defensa y patrocinio público prioritario e indelegable.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_tutelas",
    category: "reservada",
    name: "Tutelas",
    shortName: "Tutelas",
    legalBasis: "Arts. 104 a 137 CCCN",
    description: "Designación, discernimiento y control del cargo tutelar respecto a personas menores de edad.",
    economicRule: "Materia Reservada a la Defensoría Oficial. Intervención legal obligatoria.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_adopciones",
    category: "reservada",
    name: "Adopciones",
    shortName: "Adopciones",
    legalBasis: "Arts. 594 a 637 CCCN",
    description: "Declaración de adoptabilidad, guarda con fines de adopción y juicios de adopción plena, simple o de integración.",
    economicRule: "Materia Reservada a la Defensoría Oficial. Atención pública prioritaria.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_filiaciones",
    category: "reservada",
    name: "Filiaciones",
    shortName: "Filiaciones",
    legalBasis: "Arts. 558 a 587 CCCN",
    description: "Acciones de reclamación de la filiación, emplazamiento en estado de hijo/a y realización de pericias genéticas de ADN.",
    economicRule: "Materia Reservada a la Defensoría Oficial. Derecho humano a la identidad tutelado prioritariamente.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_impugnacion_paternidad",
    category: "reservada",
    name: "Impugnación de paternidad",
    shortName: "Impugnación de Paternidad",
    legalBasis: "Arts. 588 a 593 CCCN",
    description: "Impugnación de la filiación presumida por ley o del reconocimiento formulado en el Registro de las Personas.",
    economicRule: "Materia Reservada a la Defensoría Oficial. Admisión directa por el Ministerio Público.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_medidas_cautelares",
    category: "reservada",
    name: "Medidas cautelares —reintegro de hijo, exclusión del hogar, protección de persona—",
    shortName: "Medidas Cautelares Urgentes",
    legalBasis: "Arts. 232 CPCCBA, Leyes 12.569 y 26.485, CCCN",
    description: "Medidas cautelares urgentes e innovativas de reintegro de hijos, exclusión de conviviente agresor y custodia tutelar.",
    economicRule: "Materia Reservada a la Defensoría Oficial. Tutela judicial efectiva urgente e indelegable.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_cuidado_persona",
    category: "reservada",
    name: "Cuidado de Persona",
    shortName: "Cuidado de Persona",
    legalBasis: "Arts. 648 a 656 CCCN",
    description: "Atribución y modalidad del cuidado personal (unipersonal o compartido, alternado o indistinto) de hijas e hijos menores.",
    economicRule: "Materia Reservada a la Defensoría Oficial. Atención y patrocinio por la Defensa Pública.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_alimentos_demandado_bajos_ingresos",
    category: "reservada",
    name: "Juicio de alimento cuando el demandado posea ingresos no superiores a dos (2) Salarios Mínimos Vitales y Móviles",
    shortName: "Alimentos (Demandado ≤ 2 SMVM)",
    legalBasis: "Convenio de Derivación, Arts. 646 y 658 CCCN",
    description: "Reclamo alimentario en casos de extrema vulnerabilidad del grupo y bajos ingresos del alimentante obligado (≤ 2 SMVM).",
    economicRule: "Materia Reservada a la Defensoría Oficial expresamente tipificada en el Convenio.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_derecho_comunicacion",
    category: "reservada",
    name: "Derecho de Comunicación. Comunicación con los hijos.",
    shortName: "Derecho de Comunicación",
    legalBasis: "Art. 652 CCCN, CDN",
    description: "Fijación, restablecimiento o ampliación del régimen de comunicación y contacto filial con niñas, niños y adolescentes.",
    economicRule: "Materia Reservada a la Defensoría Oficial. Interés superior del niño garantizado por la Defensa Pública.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_internaciones",
    category: "reservada",
    name: "Internaciones",
    shortName: "Internaciones (Salud Mental)",
    legalBasis: "Ley Nac. de Salud Mental 26.657, Art. 41 CCCN",
    description: "Control de legalidad de internaciones psiquiátricas involuntarias y garantías procesales del paciente.",
    economicRule: "Materia Reservada a la Defensoría Oficial. Representación y defensa pública forzosa.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_curatelas",
    category: "reservada",
    name: "Curatelas",
    shortName: "Curatelas",
    legalBasis: "Arts. 138 a 140 CCCN",
    description: "Régimen curatelar para personas declaradas incapaces en los términos estrictos del Código Civil y Comercial.",
    economicRule: "Materia Reservada a la Defensoría Oficial.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_amparos_salud_profe",
    category: "amparos",
    name: "Amparos de salud cuando el demandado sea el PROFE, es decir cuando se trate de pensiones no contributivas",
    shortName: "Amparo de Salud PROFE (PNC)",
    legalBasis: "Art. 43 CN, Programa Incluir Salud / PROFE, Cláusula Convenio",
    description: "Acción de amparo urgente de salud para beneficiarios de pensiones no contributivas contra el programa PROFE / Incluir Salud.",
    economicRule: "Materia Reservada Exclusiva a la Defensoría Oficial según el Convenio. No sujeta a derivación.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_inscripciones_nacimiento",
    category: "reservada",
    name: "Inscripciones de nacimiento",
    shortName: "Inscripción de Nacimiento",
    legalBasis: "Ley Pcial. 14.078, Art. 560 CCCN",
    description: "Inscripción judicial tardía de nacimiento y obtención de la primera partida de nacimiento / DNI.",
    economicRule: "Materia Reservada a la Defensoría Oficial. Tutela del derecho a la identidad legal.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_venia_matrimonial",
    category: "reservada",
    name: "Venia supletoria para contraer matrimonio",
    shortName: "Venia Matrimonial",
    legalBasis: "Art. 405 CCCN",
    description: "Autorización judicial supletoria para contraer nupcias por falta o negativa injustificada de los representantes legales.",
    economicRule: "Materia Reservada a la Defensoría Oficial.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_nulidades_matrimonios",
    category: "reservada",
    name: "Nulidades de matrimonios",
    shortName: "Nulidad de Matrimonio",
    legalBasis: "Arts. 424 a 430 CCCN",
    description: "Acciones de nulidad absoluta o relativa del matrimonio por vicios del consentimiento o impedimentos legales.",
    economicRule: "Materia Reservada a la Defensoría Oficial.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_convenio_ejercicio_parental",
    category: "reservada",
    name: "Convenio por ejercicio de la responsabilidad parental",
    shortName: "Convenio Resp. Parental",
    legalBasis: "Art. 655 CCCN",
    description: "Asistencia y redacción de acuerdos parentales sobre cuidado, alimentos y comunicación de los hijos.",
    economicRule: "Materia Reservada a la Defensoría Oficial.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_homologacion_plan_parental",
    category: "reservada",
    name: "Homologaciones de los acuerdos del plan parental",
    shortName: "Homologación Plan Parental",
    legalBasis: "Art. 655 CCCN, CPCCBA",
    description: "Presentación y trámite judicial de homologación del plan de parentalidad convenido.",
    economicRule: "Materia Reservada a la Defensoría Oficial.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_violencia_familiar",
    category: "reservada",
    name: "Protección contra la Violencia Familiar",
    shortName: "Violencia Familiar (Ley 12.569)",
    legalBasis: "Ley Pcial. 12.569, Ley Nac. 26.485, Convenio",
    description: "Denuncias, medidas protectorias de urgencia, exclusión de hogar, botón antipánico y cese de hostigamiento.",
    economicRule: "Materia Reservada a la Defensoría Oficial. Atención prioritaria, gratuita y sin restricciones económicas.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },
  {
    id: "res_danos_penal_presos",
    category: "danos_perjuicios",
    name: "Daños y perjuicios, exclusivamente cuando deriven de una cuestión penal y cuyos demandados sean personas privadas de libertad",
    shortName: "Daños y Perjuicios (Penal / Privados de Libertad)",
    legalBasis: "Cláusula Convenio de Derivación MPD - CADN",
    description: "Acciones indemnizatorias de daños causados por delitos penales cuyos demandados se encuentren privados de la libertad.",
    economicRule: "Materia Reservada Exclusiva de la Defensoría Oficial según la cláusula específica del Convenio.",
    multiplierVerde: Infinity,
    multiplierAmarillo: Infinity,
    isExclusivelyReserved: true
  },

  // =========================================================================
  // 2. DETERMINACIÓN DE CAPACIDAD JURÍDICA (Rango Ampliado: 3 a 4 SMVM)
  // =========================================================================
  {
    id: "determinacion_capacidad",
    category: "determinacion_capacidad",
    name: "Determinación de la capacidad",
    shortName: "Determinación de la Capacidad",
    legalBasis: "Arts. 31 a 43 CCCN, Ley 26.657, Convención sobre Discapacidad",
    description: "Proceso judicial de determinación de la capacidad jurídica, designación de apoyos y salvaguardias personalizadas.",
    economicRule: "Rango de ingresos ampliado para la atención. El tope para Nivel Verde se extiende a 3 SMVM y el intermedio Amarillo a 4 SMVM para garantizar el acceso a la justicia de personas con discapacidad.",
    multiplierVerde: 3.0,
    multiplierAmarillo: 4.0
  },

  // =========================================================================
  // 3. SITUACIONES ESPECIALES: DIVORCIOS (Tope 1.5 SMVM y Derivación por Regla)
  // =========================================================================
  {
    id: "divorcio",
    category: "divorcio",
    name: "Divorcios (Situación Especial: disolución de vínculo sin contenido patrimonial)",
    shortName: "Divorcios",
    legalBasis: "Arts. 437 y 438 CCCN, Cláusula Situaciones Especiales Convenio",
    description: "Procesos cuyo objeto se limite a la disolución del vínculo matrimonial, sin contenido patrimonial, sin medidas urgentes conexas y sin afectación directa de derechos de personas en situación de vulnerabilidad.",
    economicRule: "Situación Especial: Por regla no constituye intervención de la Defensoría Oficial, debiendo ser derivados al Colegio de Abogados Departamental de Necochea. Excepcionalmente, sólo podrá admitirse cuando concurran razones graves y actuales de vulnerabilidad acreditadas y el ingreso no supere 1,5 SMVM.",
    multiplierVerde: 1.5,
    multiplierAmarillo: 2.0
  },

  // =========================================================================
  // 4. SITUACIONES ESPECIALES: SUCESIONES (Tope 1.5 SMVM y Fundamento Social Grave)
  // =========================================================================
  {
    id: "sucesion_excepcional",
    category: "sucesion_excepcional",
    name: "Sucesiones (Supuesto excepcional con fundamento social grave acreditado)",
    shortName: "Sucesiones Excepcionales",
    legalBasis: "Art. 2277 CCCN, Cláusula Situaciones Especiales Convenio",
    description: "Únicamente en supuestos excepcionales en que exista un fundamento social grave, actual y debidamente acreditado en el caso concreto, y siempre que el ingreso familiar no supere 1,5 SMVM. Quedan excluidas las sucesiones que comprendan bienes registrables, liquidación, partición, adjudicación o conflicto patrimonial.",
    economicRule: "Situación Especial: Tope estricto de 1.5 SMVM y ausencia de bienes registrables en conflicto. De no cumplirse, corresponde patrocinio particular a través del Colegio de Abogados.",
    multiplierVerde: 1.5,
    multiplierAmarillo: 2.0
  },

  // =========================================================================
  // 5. ÍTEM DIFERENCIAL: AMPAROS DE SALUD
  // =========================================================================
  {
    id: "amparo_salud_general",
    category: "amparos",
    name: "Amparos de salud generales (Obras Sociales, Prepagas, IOMA o Estado Provincial)",
    shortName: "Amparos de Salud Generales",
    legalBasis: "Art. 43 CN, Art. 20 Const. Pba, Ley 13.928",
    description: "Acciones de amparo de salud por coberturas médicas, cirugías o medicamentos contra agentes de salud (excepto PROFE/PNC).",
    economicRule: "Régimen general del Convenio: Nivel Verde hasta 2 SMVM e intermedio Amarillo hasta 3 SMVM con evaluación de vulnerabilidad.",
    multiplierVerde: 2.0,
    multiplierAmarillo: 3.0
  },

  // =========================================================================
  // 6. ÍTEM DIFERENCIAL: DAÑOS Y PERJUICIOS
  // =========================================================================
  {
    id: "danos_perjuicios_ordinarios",
    category: "danos_perjuicios",
    name: "Daños y perjuicios ordinarios / Responsabilidad Civil común",
    shortName: "Daños y Perjuicios Ordinarios",
    legalBasis: "Arts. 1708 a 1780 CCCN",
    description: "Reclamos indemnizatorios por accidentes o incumplimientos que no deriven de causa penal con personas detenidas.",
    economicRule: "No constituye materia reservada. Corresponde por regla la derivación al Colegio de Abogados de Necochea para patrocinio por letrados particulares.",
    multiplierVerde: 2.0,
    multiplierAmarillo: 3.0
  },

  // =========================================================================
  // 7. MATERIAS ORDINARIAS / RÉGIMEN GENERAL (2 SMVM)
  // =========================================================================
  {
    id: "general_alimentos",
    category: "general",
    name: "Juicio de alimentos ordinario (Régimen General con demandado > 2 SMVM)",
    shortName: "Alimentos (Régimen General)",
    legalBasis: "Arts. 646, 658 CCCN, Convenio de Derivación",
    description: "Reclamos alimentarios ordinarios cuando el demandado posee ingresos superiores a 2 SMVM pero el consultante carece de recursos.",
    economicRule: "Régimen general del Convenio: Nivel Verde hasta 2 SMVM e intermedio Amarillo hasta 3 SMVM.",
    multiplierVerde: 2.0,
    multiplierAmarillo: 3.0
  },
  {
    id: "general_desalojo",
    category: "general",
    name: "Defensa en Desalojo / Acciones Posesorias de Vivienda Única",
    shortName: "Desalojo / Vivienda Única",
    legalBasis: "Arts. 1909 CCCN, CPCCBA",
    description: "Defensa de familias vulnerables en riesgo de perder su vivienda única familiar.",
    economicRule: "Régimen general del Convenio: Nivel Verde hasta 2 SMVM e intermedio Amarillo hasta 3 SMVM.",
    multiplierVerde: 2.0,
    multiplierAmarillo: 3.0
  },
  {
    id: "general_otro",
    category: "general",
    name: "Otras Materias Civiles, Comerciales o de Familia (Labor Jurídica General)",
    shortName: "Otras Materias (Régimen General)",
    legalBasis: "Convenio de Derivación MPD - CADN",
    description: "Asistencia o patrocinio gratuito en juicio de personas que carezcan de recursos suficientes (ingresos del grupo familiar no superen 2 SMVM).",
    economicRule: "Labor jurídica general: ingresos del grupo familiar no superiores a 2 SMVM.",
    multiplierVerde: 2.0,
    multiplierAmarillo: 3.0
  }
];

export function getTramiteDefinition(tipoId?: string, categoria?: TramiteCategory): TramiteDefinition {
  if (tipoId) {
    const found = TRAMITES_CATALOGUE.find(t => t.id === tipoId);
    if (found) return found;
  }
  if (categoria) {
    const foundCat = TRAMITES_CATALOGUE.find(t => t.category === categoria);
    if (foundCat) return foundCat;
  }
  // Default to general alimentos
  return TRAMITES_CATALOGUE.find(t => t.id === "general_alimentos") || TRAMITES_CATALOGUE[0];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// INDEC Tabla de equivalencias de adultos según sexo y edad (Adultos Equivalentes)
export function getAdultEquivalentCoefficient(
  age: number,
  sex: "Masculino" | "Femenino" | "Otro"
): number {
  if (sex === "Masculino") {
    if (age <= 29) return 1.02;
    if (age <= 60) return 1.00;
    if (age <= 75) return 0.83;
    return 0.74;
  } else if (sex === "Femenino") {
    if (age <= 29) return 0.76;
    if (age <= 60) return 0.77;
    if (age <= 75) return 0.67;
    return 0.63;
  } else { // Otro / promedio
    if (age <= 29) return 0.89;
    if (age <= 60) return 0.88;
    if (age <= 75) return 0.75;
    return 0.68;
  }
}

export function getBracketFromAge(
  age: number
): "under1" | "1to3" | "4to5" | "6to12" | "13to18" {
  if (age < 1) return "under1";
  if (age <= 3) return "1to3";
  if (age <= 5) return "4to5";
  if (age <= 12) return "6to12";
  return "13to18";
}

export function getBracketLabel(
  bracket: "under1" | "1to3" | "4to5" | "6to12" | "13to18"
): string {
  switch (bracket) {
    case "under1":
      return "Lactancia (<1 año)";
    case "1to3":
      return "1 a 3 años";
    case "4to5":
      return "4 a 5 años";
    case "6to12":
      return "6 a 12 años";
    case "13to18":
      return "13 a 18 años";
  }
}

// INDEC Tabla de equivalencias de necesidades energéticas (Adultos Equivalentes por edad)
export function getChildEquivalentCoefficient(
  bracket: "under1" | "1to3" | "4to5" | "6to12" | "13to18"
): number {
  switch (bracket) {
    case "under1":
      return 0.35; // Lactancia (<1 año)
    case "1to3":
      return 0.45; // 1 a 3 años
    case "4to5":
      return 0.60; // 4 a 5 años
    case "6to12":
      return 0.75; // 6 a 12 años
    case "13to18":
      return 1.00; // Adolescente (13 a 18 años)
  }
}

// Returns the child's individual CBT contribution for rendering purposes
export function calculateCrianzaValue(
  bracket: "under1" | "1to3" | "4to5" | "6to12" | "13to18",
  params: EconomicParams
): number {
  return getChildEquivalentCoefficient(bracket) * params.cbt;
}

export function evaluateLevelShift(
  input: EvaluationInput,
  params: EconomicParams
): EvaluationResult {
  const { 
    ingresoBruto, 
    gastosSalud, 
    adults, 
    children, 
    disabledMinors, 
    disabledAdults, 
    vulnerabilities, 
    occupancyStatus, 
    montoAlquiler,
    tramiteTipo,
    tramiteCategoria
  } = input;

  // 0. Identify Tramite Definition and Economic Rules
  const tramiteDef = getTramiteDefinition(tramiteTipo, tramiteCategoria);
  const effectiveCategory = tramiteDef.category;
  const isMateriaReservada = Boolean(effectiveCategory === "reservada" || tramiteDef.multiplierVerde === Infinity || tramiteDef.isExclusivelyReserved);
  const isRangoAmpliado = effectiveCategory === "determinacion_capacidad" || tramiteDef.id === "determinacion_capacidad";
  const isTopeDivorcio = effectiveCategory === "divorcio" || tramiteDef.id === "divorcio";
  const isTopeSucesion = effectiveCategory === "sucesion_excepcional" || tramiteDef.id === "sucesion_excepcional";
  const isAmparoProfe = tramiteDef.id === "res_amparos_salud_profe";
  const isDanosPerjuiciosPenal = tramiteDef.id === "res_danos_penal_presos";

  // 1. Calculate Household equivalent adult count (adeqTotal)
  let adeqTotal = 0;
  if (adults && adults.length > 0) {
    adults.forEach((adult) => {
      adeqTotal += getAdultEquivalentCoefficient(adult.age, adult.sex);
    });
  } else {
    const baseAdults = params.adultsCount || 1;
    adeqTotal = baseAdults * 1.0;
  }
  
  if (children && children.length > 0) {
    children.forEach((child) => {
      adeqTotal += getChildEquivalentCoefficient(child.ageBracket);
    });
  }

  if (disabledMinors && disabledMinors.length > 0) {
    disabledMinors.forEach((dm) => {
      adeqTotal += getChildEquivalentCoefficient(dm.ageBracket);
    });
  }

  if (disabledAdults && disabledAdults.length > 0) {
    disabledAdults.forEach((da) => {
      adeqTotal += getAdultEquivalentCoefficient(da.age, da.sex);
    });
  }

  // 2. Calculate Household CBA and CBT based on total adult equivalents
  const cbaTotal = adeqTotal * params.cba;
  const cbtTotal = adeqTotal * params.cbt;

  // 3. Rent expense deduction if rented
  const rentExpense = (occupancyStatus === "Inquilino" && typeof montoAlquiler === "number") ? Math.max(0, montoAlquiler) : 0;

  // 4. Calculate INA (Ingreso Neto Ajustado): Ingreso Bruto - CBT - Gastos Salud - Alquiler
  const ina = ingresoBruto - cbtTotal - gastosSalud - rentExpense;

  // 5. Calculate IVS (Índice de Vulnerabilidad Social)
  let ivsScore = 0;
  if (vulnerabilities.violenciaGenero) ivsScore += 3;
  if (vulnerabilities.discapacidad || (disabledMinors && disabledMinors.length > 0) || (disabledAdults && disabledAdults.length > 0) || (input.disabledPersons && input.disabledPersons.length > 0)) {
    ivsScore += 2;
  }
  if (vulnerabilities.hogarMonoparental) ivsScore += 2;
  if (vulnerabilities.enfermedadTrabajoInformal) ivsScore += 1;

  // 6. Thresholds based on Tramite Type and Convenio rules
  let threshold2SMVM = params.smvm * 2;
  let threshold3SMVM = params.smvm * 3;

  if (isRangoAmpliado) {
    // Determinación de capacidad: rango ampliado (3 SMVM para Verde, 4 SMVM para Amarillo)
    threshold2SMVM = params.smvm * 3;
    threshold3SMVM = params.smvm * 4;
  } else if (isTopeDivorcio || isTopeSucesion) {
    // Divorcio y Sucesión excepcional: tope diferenciado y restrictivo (1.5 SMVM para Verde, 2 SMVM para Amarillo)
    threshold2SMVM = params.smvm * 1.5;
    threshold3SMVM = params.smvm * 2.0;
  }

  // 7. Base Level Determination
  let baseLevel = JudicialLevel.ROJO;
  let finalLevel = JudicialLevel.ROJO;
  let reclassificationReason = "";
  let isShifted = false;
  let shiftDirection: "up" | "down" | "none" = "none";

  // CASE A: MATERIA RESERVADA A LA DEFENSORÍA (Exclusiva e Indelegable)
  if (isMateriaReservada) {
    baseLevel = JudicialLevel.VERDE;
    finalLevel = JudicialLevel.VERDE;
    if (isAmparoProfe) {
      reclassificationReason = `Materia Reservada a la Defensoría Oficial (Amparo de Salud PROFE / Pensiones No Contributivas). Atención pública obligatoria e indelegable sin derivación.`;
    } else if (isDanosPerjuiciosPenal) {
      reclassificationReason = `Materia Reservada a la Defensoría Oficial (Daños y Perjuicios derivados de causa penal con demandados privados de libertad). Intervención legal forzosa de la Defensa Pública.`;
    } else {
      reclassificationReason = `Materia Reservada a la Defensoría Oficial según el Convenio (${tramiteDef.name}). Por mandato legal y convencional, la atención de la Defensa Pública es indelegable y prioritaria, sin sujeción a topes económicos restrictivos.`;
    }
  } 
  // CASE B: DETERMINACIÓN DE CAPACIDAD (Rango Ampliado: 3 a 4 SMVM)
  else if (isRangoAmpliado) {
    if (ina <= threshold2SMVM) {
      baseLevel = JudicialLevel.VERDE;
      finalLevel = JudicialLevel.VERDE;
      reclassificationReason = `Admisible para Defensoría Oficial por Rango Ampliado de Capacidad Jurídica (Art. 31 CCCN). El INA (${formatCurrency(ina)}) es menor o igual al umbral especial de 3 SMVM (${formatCurrency(threshold2SMVM)}).`;
    } else if (ina > threshold2SMVM && ina <= threshold3SMVM) {
      baseLevel = JudicialLevel.AMARILLO;
      finalLevel = JudicialLevel.AMARILLO;
      reclassificationReason = `Evaluación Excepcional en Determinación de Capacidad. El INA (${formatCurrency(ina)}) se sitúa en el rango intermedio ampliado de 3 a 4 SMVM (${formatCurrency(threshold3SMVM)}).`;
      
      // Shift from Amarillo to Verde if high vulnerability
      if (ivsScore >= 3) {
        finalLevel = JudicialLevel.VERDE;
        reclassificationReason = `Caso reclasificado de Amarillo a Verde en Determinación de Capacidad: el INA se encuentra en el rango de 3 a 4 SMVM y concurre vulnerabilidad social (IVS: ${ivsScore} pts), correspondiendo patrocinio oficial.`;
        isShifted = true;
        shiftDirection = "up";
      }
    } else {
      baseLevel = JudicialLevel.ROJO;
      finalLevel = JudicialLevel.ROJO;
      
      // Check shift from Rojo to Amarillo
      if (ina < threshold3SMVM || ivsScore >= 4) {
        finalLevel = JudicialLevel.AMARILLO;
        reclassificationReason = `Caso reclasificado de Rojo a Amarillo en Determinación de Capacidad por tutela de salud mental y vulnerabilidad acreditada (IVS: ${ivsScore} pts).`;
        isShifted = true;
        shiftDirection = "up";
      } else {
        reclassificationReason = `Derivación al Colegio de Abogados. En Determinación de Capacidad, el INA (${formatCurrency(ina)}) supera el umbral máximo ampliado de 4 SMVM (${formatCurrency(threshold3SMVM)}) con solvencia demostrada.`;
      }
    }
  }
  // CASE C: SITUACIÓN ESPECIAL - DIVORCIOS (Tope 1.5 SMVM y Derivación por Regla)
  else if (isTopeDivorcio) {
    if (ina <= threshold2SMVM) {
      baseLevel = JudicialLevel.VERDE;
      finalLevel = JudicialLevel.VERDE;
      reclassificationReason = `Admisible para Defensoría Oficial en trámite de Divorcio. Conforme a la cláusula de Situaciones Especiales, concurren razones de vulnerabilidad y el INA (${formatCurrency(ina)}) no supera el tope de 1.5 SMVM (${formatCurrency(threshold2SMVM)}).`;
    } else if (ina > threshold2SMVM && ina <= threshold3SMVM) {
      baseLevel = JudicialLevel.AMARILLO;
      finalLevel = JudicialLevel.AMARILLO;
      reclassificationReason = `Evaluación Excepcional en Divorcio. El INA (${formatCurrency(ina)}) está entre 1.5 y 2 SMVM (${formatCurrency(threshold3SMVM)}). Requiere acreditar razones graves y actuales de vulnerabilidad debidamente fundadas para evitar la derivación al Colegio de Abogados.`;
      
      if (ivsScore >= 5 || vulnerabilities.violenciaGenero) {
        finalLevel = JudicialLevel.VERDE;
        reclassificationReason = `Caso de Divorcio reclasificado de Amarillo a Verde por alta vulnerabilidad familiar/violencia acreditada (IVS: ${ivsScore} pts).`;
        isShifted = true;
        shiftDirection = "up";
      }
    } else {
      baseLevel = JudicialLevel.ROJO;
      finalLevel = JudicialLevel.ROJO;
      reclassificationReason = `Derivación al Colegio de Abogados Departamental de Necochea. En procesos de Divorcio sin contenido patrimonial ni medidas conexas, por regla no corresponde intervención de la Defensoría Oficial y el INA (${formatCurrency(ina)}) supera el tope de 1.5 / 2 SMVM (${formatCurrency(threshold3SMVM)}).`;
    }
  }
  // CASE D: SITUACIÓN ESPECIAL - SUCESIONES (Tope 1.5 SMVM y Fundamento Social Grave)
  else if (isTopeSucesion) {
    if (ina <= threshold2SMVM) {
      baseLevel = JudicialLevel.VERDE;
      finalLevel = JudicialLevel.VERDE;
      reclassificationReason = `Admisible para Defensoría Oficial en Sucesión con Fundamento Social Grave. El INA (${formatCurrency(ina)}) no supera el tope de 1.5 SMVM (${formatCurrency(threshold2SMVM)}) y no existen bienes registrables en litigio patrimonial.`;
    } else if (ina > threshold2SMVM && ina <= threshold3SMVM) {
      baseLevel = JudicialLevel.AMARILLO;
      finalLevel = JudicialLevel.AMARILLO;
      reclassificationReason = `Evaluación Excepcional en Sucesión Social. El INA (${formatCurrency(ina)}) se sitúa entre 1.5 y 2 SMVM (${formatCurrency(threshold3SMVM)}). Requiere fundamentación fundada de situación de vulnerabilidad social grave.`;
      
      if (ivsScore >= 4) {
        finalLevel = JudicialLevel.VERDE;
        reclassificationReason = `Sucesión reclasificada a Verde por vulnerabilidad social grave comprobada (IVS: ${ivsScore} pts).`;
        isShifted = true;
        shiftDirection = "up";
      }
    } else {
      baseLevel = JudicialLevel.ROJO;
      finalLevel = JudicialLevel.ROJO;
      reclassificationReason = `Derivación al Colegio de Abogados en Sucesiones. El INA (${formatCurrency(ina)}) supera el tope de 1.5 SMVM (${formatCurrency(threshold2SMVM)}) o comprende bienes que exceden el marco social de asistencia gratuita.`;
    }
  }
  // CASE E: MATERIAS ORDINARIAS / RÉGIMEN GENERAL (2 SMVM)
  else {
    if (ina <= threshold2SMVM) {
      baseLevel = JudicialLevel.VERDE;
      finalLevel = JudicialLevel.VERDE;
      reclassificationReason = `Admisible para Defensoría Oficial. El Ingreso Neto Ajustado (${formatCurrency(ina)}) es menor o igual al límite básico de 2 SMVM (${formatCurrency(threshold2SMVM)}) conforme al Convenio de Derivación.`;
    } else if (ina > threshold2SMVM && ina <= threshold3SMVM) {
      baseLevel = JudicialLevel.AMARILLO;
      finalLevel = JudicialLevel.AMARILLO;
      reclassificationReason = `Sometido a Evaluación Excepcional. El Ingreso Neto Ajustado (${formatCurrency(ina)}) se encuentra en el rango intermedio entre 2 y 3 SMVM (${formatCurrency(threshold3SMVM)}).`;
      
      // Shift: Amarillo to Verde (If INA is yellow but IVS >= 5)
      if (ivsScore >= 5) {
        finalLevel = JudicialLevel.VERDE;
        reclassificationReason = `Caso reclasificado de Amarillo a Verde por alta vulnerabilidad social (IVS: ${ivsScore} pts >= 5) conforme al Convenio de Admisión de Necochea.`;
        isShifted = true;
        shiftDirection = "up";
      }
    } else {
      baseLevel = JudicialLevel.ROJO;
      finalLevel = JudicialLevel.ROJO;
      
      const cbtPercentageOfGross = ingresoBruto > 0 ? (cbtTotal / ingresoBruto) * 100 : 0;
      
      if (ina < threshold3SMVM) {
        finalLevel = JudicialLevel.AMARILLO;
        const rentText = rentExpense > 0 ? ", canon locativo de alquiler" : "";
        reclassificationReason = `Caso reclasificado de Rojo a Amarillo porque el Ingreso Neto Ajustado (${formatCurrency(ina)}) se sitúa por debajo del límite de 3 SMVM (${formatCurrency(threshold3SMVM)}) tras deducir la Canasta Básica Total (CBT) del hogar, gastos médicos indispensables${rentText}.`;
        isShifted = true;
        shiftDirection = "up";
      } else if (cbtPercentageOfGross > 50) {
        finalLevel = JudicialLevel.AMARILLO;
        reclassificationReason = `Caso reclasificado de Rojo a Amarillo porque la Canasta Básica Total del hogar (${formatCurrency(cbtTotal)}) representa el ${cbtPercentageOfGross.toFixed(1)}% del ingreso bruto del hogar (supera el límite de protección del 50%).`;
        isShifted = true;
        shiftDirection = "up";
      } else if (ivsScore >= 3) {
        finalLevel = JudicialLevel.AMARILLO;
        reclassificationReason = `Caso reclasificado de Rojo a Amarillo debido a un Índice de Vulnerabilidad Social significativo (IVS: ${ivsScore} pts >= 3) en presencia de ingresos superiores al límite económico.`;
        isShifted = true;
        shiftDirection = "up";
      } else {
        reclassificationReason = `Asignado al Colegio de Abogados de Necochea. El Ingreso Neto Ajustado (${formatCurrency(ina)}) supera el límite de 3 SMVM (${formatCurrency(threshold3SMVM)}) con un bajo índice de vulnerabilidad (IVS: ${ivsScore} pts).`;
      }
    }
  }

  return {
    tramiteCategoria: effectiveCategory,
    tramiteTipo: tramiteDef.id,
    tramiteNombre: tramiteDef.name,
    isMateriaReservada,
    isRangoAmpliado,
    isTopeDivorcio,
    isTopeSucesion,
    isDanosPerjuiciosPenal,
    isAmparoProfe,
    threshold2SMVM,
    threshold3SMVM,
    adeqTotal,
    cbaTotal,
    cbtTotal,
    ina,
    ivsScore,
    baseLevel,
    finalLevel,
    reclassificationReason,
    isShifted,
    shiftDirection
  };
}
