export type Duracion = "Bimestral" | "Semestral" | "Anual";

export type Materia = {
  codigo: string;
  nombre: string;
  cuatrimestreInicial: number | [number, number] | null;
  duracion: Duracion;
  cargaHoraria: string;
};

// prettier-ignore
export const MATERIAS: Materia[] = [
  // 1er año (CBC)
  { codigo: "CBC-QUIMICA",                   nombre: "Química",                                                 cuatrimestreInicial: [1, 2], duracion: "Semestral", cargaHoraria: "6" },
  { codigo: "CBC-MATEMATICA",                nombre: "Matemática",                                              cuatrimestreInicial: [1, 2], duracion: "Semestral", cargaHoraria: "6" },
  { codigo: "CBC-FISICA_BIOFISICA",          nombre: "Física e Introducción a la Biofísica",                    cuatrimestreInicial: [1, 2], duracion: "Semestral", cargaHoraria: "6" },
  { codigo: "CBC-BIOLOGIA_BIOLOGIA_CELULAR", nombre: "Biología e Introducción a la Biología Celular",           cuatrimestreInicial: [1, 2], duracion: "Semestral", cargaHoraria: "6" },
  { codigo: "CBC-ICSE",                      nombre: "Introducción al Conocimiento de la Sociedad y el Estado", cuatrimestreInicial: [1, 2], duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "CBC-IPC",                       nombre: "Introducción al Pensamiento Científico",                  cuatrimestreInicial: [1, 2], duracion: "Semestral", cargaHoraria: "4" },

  // 2do año
  { codigo: "N100", nombre: "Inglés Técnico",                                     cuatrimestreInicial: [3,  4], duracion: "Bimestral", cargaHoraria: "4" },
  { codigo: "N101", nombre: "Anatomía General y Estomatológica",                  cuatrimestreInicial: 3,       duracion: "Anual",     cargaHoraria: "8 horas 1er. semestre / 4 horas 2do. semestre" },
  { codigo: "N102", nombre: "Bioquímica General",                                 cuatrimestreInicial: 3,       duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N103", nombre: "Histología y Embriología",                           cuatrimestreInicial: 3,       duracion: "Semestral", cargaHoraria: "8" },
  { codigo: "N105", nombre: "Inmunología y Microbiología I",                      cuatrimestreInicial: 4,       duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N106", nombre: "Biología Bucal",                                     cuatrimestreInicial: 4,       duracion: "Semestral", cargaHoraria: "6 horas 1ra. parte del semestre / 4 horas 2da. parte del semestre" },
  { codigo: "N110", nombre: "Inserción Temprana en la Clínica",                   cuatrimestreInicial: [3,  4], duracion: "Bimestral", cargaHoraria: "4" },
  { codigo: "N108", nombre: "Biofísica Aplicada a la Práctica Odontológica",      cuatrimestreInicial: 4,       duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N111", nombre: "Diagnóstico por Imágenes con Radiofísica Sanitaria", cuatrimestreInicial: 4,       duracion: "Semestral", cargaHoraria: "4" },

  // 3er año
  { codigo: "N201", nombre: "Fisiología",                                       cuatrimestreInicial: 5, duracion: "Anual",     cargaHoraria: "8 horas 1er. semestre / 4 horas 2do. semestre" },
  { codigo: "N202", nombre: "Patología General",                                cuatrimestreInicial: 5, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N203", nombre: "Materiales Dentales I",                            cuatrimestreInicial: 5, duracion: "Bimestral", cargaHoraria: "4" },
  { codigo: "N204", nombre: "Preclínica de Odontología Restauradora I",         cuatrimestreInicial: 5, duracion: "Bimestral", cargaHoraria: "4" },
  { codigo: "N206", nombre: "Odontología Preventiva y Mínimamente Invasiva I",  cuatrimestreInicial: 5, duracion: "Semestral", cargaHoraria: "8" },
  { codigo: "N211", nombre: "Preclínica Quirúrgica y Anestesia",                cuatrimestreInicial: 5, duracion: "Bimestral", cargaHoraria: "4" },
  { codigo: "N205", nombre: "Microbiología II",                                 cuatrimestreInicial: 5, duracion: "Bimestral", cargaHoraria: "4" },
  { codigo: "N207", nombre: "Odontología Preventiva y Mínimamente Invasiva II", cuatrimestreInicial: 6, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N208", nombre: "Preclínica de Odontología Restauradora II",        cuatrimestreInicial: 6, duracion: "Semestral", cargaHoraria: "8" },
  { codigo: "N209", nombre: "Endodoncia I",                                     cuatrimestreInicial: 6, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N210", nombre: "Patología Bucal",                                  cuatrimestreInicial: 6, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N212", nombre: "Materiales Dentales II",                           cuatrimestreInicial: 6, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N213", nombre: "Bioética y Ejercicio Profesional",                 cuatrimestreInicial: 6, duracion: "Bimestral", cargaHoraria: "4" },
  { codigo: "N214", nombre: "Introducción a la Periodoncia",                    cuatrimestreInicial: 6, duracion: "Bimestral", cargaHoraria: "4" },

  // 4to año
  { codigo: "N302", nombre: "Preclínica de Rehabilitación Protética",           cuatrimestreInicial: 7,      duracion: "Anual",     cargaHoraria: "8" },
  { codigo: "N303", nombre: "Farmacología",                                     cuatrimestreInicial: 7,      duracion: "Anual",     cargaHoraria: "4" },
  { codigo: "N304", nombre: "Medicina Interna en la Práctica Odontológica",     cuatrimestreInicial: 7,      duracion: "Anual",     cargaHoraria: "29 semanas de 4 horas + 5 semanas de 8 horas" },
  { codigo: "N308", nombre: "Endodoncia II",                                    cuatrimestreInicial: 7,      duracion: "Anual",     cargaHoraria: "4" },
  { codigo: "N309", nombre: "Periodoncia",                                      cuatrimestreInicial: 7,      duracion: "Anual",     cargaHoraria: "4" },
  { codigo: "N310", nombre: "Odontología Restauradora",                         cuatrimestreInicial: 7,      duracion: "Anual",     cargaHoraria: "4" },
  { codigo: "N306", nombre: "Bioestadística y Metodología de la Investigación", cuatrimestreInicial: 7,      duracion: "Bimestral", cargaHoraria: "4" },
  { codigo: "N305", nombre: "Historia de la Odontología",                       cuatrimestreInicial: [7, 8], duracion: "Bimestral", cargaHoraria: "4" },
  { codigo: "N311", nombre: "Cirugía y Traumatología Bucomaxilofacial I",       cuatrimestreInicial: 7,      duracion: "Anual",     cargaHoraria: "4" },

  // 5to año
  { codigo: "N401", nombre: "Odontología Rehabilitadora Integral",         cuatrimestreInicial: 9,  duracion: "Anual",     cargaHoraria: "10" },
  { codigo: "N402", nombre: "Cirugía y Traumatología Bucomáxilofacial II", cuatrimestreInicial: 9,  duracion: "Anual",     cargaHoraria: "4" },
  { codigo: "N403", nombre: "Odontología Integral Niños y Adolescentes",   cuatrimestreInicial: 9,  duracion: "Anual",     cargaHoraria: "8" },
  { codigo: "N405", nombre: "Materiales Dentales III",                     cuatrimestreInicial: 9,  duracion: "Bimestral", cargaHoraria: "4" },
  { codigo: "N407", nombre: "Diagnóstico por Imágenes II",                 cuatrimestreInicial: 9,  duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N404", nombre: "Medicina Bucal I",                            cuatrimestreInicial: 10, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N409", nombre: "Epidemiología y Salud de las Poblaciones",    cuatrimestreInicial: 10, duracion: "Semestral", cargaHoraria: "3" },

  // 6to año
  { codigo: "N501", nombre: "Odontología Integral Adultos (PPS)",                                       cuatrimestreInicial: 11, duracion: "Anual",     cargaHoraria: "8" },
  { codigo: "N503", nombre: "Articulación Docencia-Servicio-Investigación (Práctica Social Educativa)", cuatrimestreInicial: 11, duracion: "Anual",     cargaHoraria: "31 semanas de 4 horas + 3 semanas de 8 horas" },
  { codigo: "N506", nombre: "Ortodoncia I",                                                             cuatrimestreInicial: 11, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N504", nombre: "Medicina Bucal II",                                                        cuatrimestreInicial: 11, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N502", nombre: "Cirugía y Traumatología Bucomáxilofacial III",                             cuatrimestreInicial: 11, duracion: "Anual",     cargaHoraria: "4" },
  { codigo: "N507", nombre: "Odontología Forense",                                                      cuatrimestreInicial: 11, duracion: "Bimestral", cargaHoraria: "4" },
  { codigo: "N508", nombre: "Sistema de Salud y Gestión Clínica",                                       cuatrimestreInicial: 12, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N509", nombre: "Odontología Integral para el Adulto Mayor",                                cuatrimestreInicial: 11, duracion: "Anual",     cargaHoraria: "25 semanas de 4 horas + 9 semanas de 8 horas" },

  // Módulo Electivo Asistencial Orientado
  { codigo: "N601", nombre: "Riesgo Sistémico de la Patología Buco-Dental",             cuatrimestreInicial: null, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N602", nombre: "Atención Odontológica en Pacientes con Discapacidad",      cuatrimestreInicial: null, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N603", nombre: "Ortodoncia II",                                            cuatrimestreInicial: null, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N604", nombre: "Programa Rural de Atención Odontológica",                  cuatrimestreInicial: null, duracion: "Bimestral", cargaHoraria: "8" },
  { codigo: "N605", nombre: "Traumatismos Dentarios",                                   cuatrimestreInicial: null, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N606", nombre: "Tomografía Computada en la Práctica Clínica Odontológica", cuatrimestreInicial: null, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N607", nombre: "Atención Integral de Pacientes con Sequedad Bucal",        cuatrimestreInicial: null, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N608", nombre: "Módulo Asistencial Integrado de Baja Complejidad",         cuatrimestreInicial: null, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N609", nombre: "Nuevas Tecnologías en Odontología Rehabilitadora",         cuatrimestreInicial: null, duracion: "Semestral", cargaHoraria: "4" },
  { codigo: "N610", nombre: "Módulo Asistencial de Urgencias Odontológicas",            cuatrimestreInicial: null, duracion: "Semestral", cargaHoraria: "4" },
];

export type Correlatividad = {
  codigoCorrelativa: string;
  codigoDependiente: string;
};

// prettier-ignore
export const CORRELATIVIDADES: Correlatividad[] = [
  // 2do año
  { codigoCorrelativa: "CBC-QUIMICA", codigoDependiente: "N100" },
  { codigoCorrelativa: "CBC-MATEMATICA", codigoDependiente: "N100" },
  { codigoCorrelativa: "CBC-FISICA_BIOFISICA", codigoDependiente: "N100" },
  { codigoCorrelativa: "CBC-BIOLOGIA_BIOLOGIA_CELULAR", codigoDependiente: "N100" },
  { codigoCorrelativa: "CBC-IPC", codigoDependiente: "N100" },
  { codigoCorrelativa: "CBC-ICSE", codigoDependiente: "N100" },

  { codigoCorrelativa: "CBC-QUIMICA", codigoDependiente: "N101" },
  { codigoCorrelativa: "CBC-MATEMATICA", codigoDependiente: "N101" },
  { codigoCorrelativa: "CBC-FISICA_BIOFISICA", codigoDependiente: "N101" },
  { codigoCorrelativa: "CBC-BIOLOGIA_BIOLOGIA_CELULAR", codigoDependiente: "N101" },
  { codigoCorrelativa: "CBC-IPC", codigoDependiente: "N101" },
  { codigoCorrelativa: "CBC-ICSE", codigoDependiente: "N101" },

  { codigoCorrelativa: "CBC-QUIMICA", codigoDependiente: "N102" },
  { codigoCorrelativa: "CBC-MATEMATICA", codigoDependiente: "N102" },
  { codigoCorrelativa: "CBC-FISICA_BIOFISICA", codigoDependiente: "N102" },
  { codigoCorrelativa: "CBC-BIOLOGIA_BIOLOGIA_CELULAR", codigoDependiente: "N102" },
  { codigoCorrelativa: "CBC-IPC", codigoDependiente: "N102" },
  { codigoCorrelativa: "CBC-ICSE", codigoDependiente: "N102" },

  { codigoCorrelativa: "CBC-QUIMICA", codigoDependiente: "N103" },
  { codigoCorrelativa: "CBC-MATEMATICA", codigoDependiente: "N103" },
  { codigoCorrelativa: "CBC-FISICA_BIOFISICA", codigoDependiente: "N103" },
  { codigoCorrelativa: "CBC-BIOLOGIA_BIOLOGIA_CELULAR", codigoDependiente: "N103" },
  { codigoCorrelativa: "CBC-IPC", codigoDependiente: "N103" },
  { codigoCorrelativa: "CBC-ICSE", codigoDependiente: "N103" },

  { codigoCorrelativa: "N102", codigoDependiente: "N105" },
  { codigoCorrelativa: "N103", codigoDependiente: "N105" },

  { codigoCorrelativa: "N102", codigoDependiente: "N106" },
  { codigoCorrelativa: "N103", codigoDependiente: "N106" },

  { codigoCorrelativa: "N102", codigoDependiente: "N108" },

  { codigoCorrelativa: "CBC-QUIMICA", codigoDependiente: "N110" },
  { codigoCorrelativa: "CBC-MATEMATICA", codigoDependiente: "N110" },
  { codigoCorrelativa: "CBC-FISICA_BIOFISICA", codigoDependiente: "N110" },
  { codigoCorrelativa: "CBC-BIOLOGIA_BIOLOGIA_CELULAR", codigoDependiente: "N110" },
  { codigoCorrelativa: "CBC-IPC", codigoDependiente: "N110" },
  { codigoCorrelativa: "CBC-ICSE", codigoDependiente: "N110" },

  { codigoCorrelativa: "N103", codigoDependiente: "N111" },

  // 3er año
  { codigoCorrelativa: "N106", codigoDependiente: "N201" },
  { codigoCorrelativa: "N108", codigoDependiente: "N201" },

  { codigoCorrelativa: "N105", codigoDependiente: "N202" },
  { codigoCorrelativa: "N106", codigoDependiente: "N202" },

  { codigoCorrelativa: "N108", codigoDependiente: "N203" },

  { codigoCorrelativa: "N101", codigoDependiente: "N204" },
  { codigoCorrelativa: "N110", codigoDependiente: "N204" },
  { codigoCorrelativa: "N106", codigoDependiente: "N204" },

  { codigoCorrelativa: "N101", codigoDependiente: "N206" },
  { codigoCorrelativa: "N105", codigoDependiente: "N206" },
  { codigoCorrelativa: "N106", codigoDependiente: "N206" },
  { codigoCorrelativa: "N110", codigoDependiente: "N206" },
  { codigoCorrelativa: "N111", codigoDependiente: "N206" },

  { codigoCorrelativa: "N101", codigoDependiente: "N211" },
  { codigoCorrelativa: "N110", codigoDependiente: "N211" },
  { codigoCorrelativa: "N105", codigoDependiente: "N211" },

  { codigoCorrelativa: "N105", codigoDependiente: "N205" },

  { codigoCorrelativa: "N204", codigoDependiente: "N207" },
  { codigoCorrelativa: "N206", codigoDependiente: "N207" },
  { codigoCorrelativa: "N211", codigoDependiente: "N207" },

  { codigoCorrelativa: "N203", codigoDependiente: "N208" },
  { codigoCorrelativa: "N204", codigoDependiente: "N208" },
  { codigoCorrelativa: "N206", codigoDependiente: "N208" },

  { codigoCorrelativa: "N204", codigoDependiente: "N209" },
  { codigoCorrelativa: "N206", codigoDependiente: "N209" },
  { codigoCorrelativa: "N211", codigoDependiente: "N209" },

  { codigoCorrelativa: "N202", codigoDependiente: "N210" },

  { codigoCorrelativa: "N203", codigoDependiente: "N212" },

  { codigoCorrelativa: "N110", codigoDependiente: "N213" },

  { codigoCorrelativa: "N206", codigoDependiente: "N214" },

  // 4to año
  { codigoCorrelativa: "N208", codigoDependiente: "N302" },
  { codigoCorrelativa: "N212", codigoDependiente: "N302" },

  { codigoCorrelativa: "N201", codigoDependiente: "N303" },
  { codigoCorrelativa: "N202", codigoDependiente: "N303" },

  { codigoCorrelativa: "N201", codigoDependiente: "N304" },
  { codigoCorrelativa: "N210", codigoDependiente: "N304" },
  { codigoCorrelativa: "N110", codigoDependiente: "N304" },

  { codigoCorrelativa: "N205", codigoDependiente: "N308" },
  { codigoCorrelativa: "N207", codigoDependiente: "N308" },
  { codigoCorrelativa: "N210", codigoDependiente: "N308" },
  { codigoCorrelativa: "N208", codigoDependiente: "N308" },
  { codigoCorrelativa: "N209", codigoDependiente: "N308" },

  { codigoCorrelativa: "N205", codigoDependiente: "N309" },
  { codigoCorrelativa: "N210", codigoDependiente: "N309" },
  { codigoCorrelativa: "N207", codigoDependiente: "N309" },
  { codigoCorrelativa: "N214", codigoDependiente: "N309" },

  { codigoCorrelativa: "N207", codigoDependiente: "N310" },
  { codigoCorrelativa: "N208", codigoDependiente: "N310" },
  { codigoCorrelativa: "N212", codigoDependiente: "N310" },

  { codigoCorrelativa: "N100", codigoDependiente: "N306" },

  { codigoCorrelativa: "CBC-QUIMICA", codigoDependiente: "N305" },
  { codigoCorrelativa: "CBC-MATEMATICA", codigoDependiente: "N305" },
  { codigoCorrelativa: "CBC-FISICA_BIOFISICA", codigoDependiente: "N305" },
  { codigoCorrelativa: "CBC-BIOLOGIA_BIOLOGIA_CELULAR", codigoDependiente: "N305" },
  { codigoCorrelativa: "CBC-IPC", codigoDependiente: "N305" },
  { codigoCorrelativa: "CBC-ICSE", codigoDependiente: "N305" },

  { codigoCorrelativa: "N205", codigoDependiente: "N311" },
  { codigoCorrelativa: "N207", codigoDependiente: "N311" },
  { codigoCorrelativa: "N210", codigoDependiente: "N311" },
  { codigoCorrelativa: "N211", codigoDependiente: "N311" },
  { codigoCorrelativa: "N201", codigoDependiente: "N311" },

  // 5to año
  { codigoCorrelativa: "N302", codigoDependiente: "N401" },
  { codigoCorrelativa: "N308", codigoDependiente: "N401" },
  { codigoCorrelativa: "N309", codigoDependiente: "N401" },
  { codigoCorrelativa: "N310", codigoDependiente: "N401" },

  { codigoCorrelativa: "N303", codigoDependiente: "N402" },
  { codigoCorrelativa: "N304", codigoDependiente: "N402" },
  { codigoCorrelativa: "N311", codigoDependiente: "N402" },

  { codigoCorrelativa: "N303", codigoDependiente: "N403" },
  { codigoCorrelativa: "N304", codigoDependiente: "N403" },
  { codigoCorrelativa: "N308", codigoDependiente: "N403" },
  { codigoCorrelativa: "N309", codigoDependiente: "N403" },
  { codigoCorrelativa: "N310", codigoDependiente: "N403" },
  { codigoCorrelativa: "N311", codigoDependiente: "N403" },

  { codigoCorrelativa: "N302", codigoDependiente: "N405" },
  { codigoCorrelativa: "N310", codigoDependiente: "N405" },

  { codigoCorrelativa: "N311", codigoDependiente: "N407" },

  { codigoCorrelativa: "N304", codigoDependiente: "N404" },
  { codigoCorrelativa: "N303", codigoDependiente: "N404" },

  { codigoCorrelativa: "N207", codigoDependiente: "N409" },
  { codigoCorrelativa: "N306", codigoDependiente: "N409" },

  // 6to año
  { codigoCorrelativa: "N401", codigoDependiente: "N501" },
  { codigoCorrelativa: "N402", codigoDependiente: "N501" },
  { codigoCorrelativa: "N404", codigoDependiente: "N501" },
  { codigoCorrelativa: "N405", codigoDependiente: "N501" },

  { codigoCorrelativa: "N402", codigoDependiente: "N502" },
  { codigoCorrelativa: "N404", codigoDependiente: "N502" },

  { codigoCorrelativa: "N403", codigoDependiente: "N503" },
  { codigoCorrelativa: "N409", codigoDependiente: "N503" },

  { codigoCorrelativa: "N401", codigoDependiente: "N509" },
  { codigoCorrelativa: "N404", codigoDependiente: "N509" },

  { codigoCorrelativa: "N403", codigoDependiente: "N506" },
  { codigoCorrelativa: "N407", codigoDependiente: "N506" },

  { codigoCorrelativa: "N404", codigoDependiente: "N504" },

  { codigoCorrelativa: "N213", codigoDependiente: "N507" },
  { codigoCorrelativa: "N401", codigoDependiente: "N507" },

  { codigoCorrelativa: "N409", codigoDependiente: "N508" },
  { codigoCorrelativa: "N507", codigoDependiente: "N508" },

  // Módulo Electivo Asistencial Orientado
  { codigoCorrelativa: "N304", codigoDependiente: "N601" },
  { codigoCorrelativa: "N304", codigoDependiente: "N602" },
  { codigoCorrelativa: "N506", codigoDependiente: "N603" },

  { codigoCorrelativa: "N409", codigoDependiente: "N604" },
  { codigoCorrelativa: "N403", codigoDependiente: "N604" },

  { codigoCorrelativa: "N308", codigoDependiente: "N605" },
  { codigoCorrelativa: "N309", codigoDependiente: "N605" },
  { codigoCorrelativa: "N402", codigoDependiente: "N605" },

  { codigoCorrelativa: "N407", codigoDependiente: "N606" },
  { codigoCorrelativa: "N404", codigoDependiente: "N607" },

  { codigoCorrelativa: "N308", codigoDependiente: "N608" },
  { codigoCorrelativa: "N310", codigoDependiente: "N608" },

  { codigoCorrelativa: "N302", codigoDependiente: "N609" },
  { codigoCorrelativa: "N407", codigoDependiente: "N609" },

  { codigoCorrelativa: "N304", codigoDependiente: "N610" },
  { codigoCorrelativa: "N308", codigoDependiente: "N610" },
];
