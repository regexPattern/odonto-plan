export type Plan = {
  anios: AnioPlan[];
  correlatividades: {
    [codigoMateria: string]: string[];
  };
};

export type AnioPlan = {
  descripcion: string;
  materias: Materia[];
};

export type Materia = {
  codigo: string;
  nombre: string;
  cuatriInicial: (1 | 2) | [1, 2] | null;
  duracion: "Bimestral" | "Semestral" | "Anual";
  horas: string;
};

// oxfmt-ignore
export const PLAN: Plan = {
  anios: [
    {
      descripcion: "CBC",
      materias: [
        { codigo: "CBC-QUIMICA",                   nombre: "Química",                                                 cuatriInicial: [1, 2], duracion: "Semestral", horas: "6" },
        { codigo: "CBC-MATEMATICA",                nombre: "Matemática",                                              cuatriInicial: [1, 2], duracion: "Semestral", horas: "6" },
        { codigo: "CBC-FISICA_BIOFISICA",          nombre: "Física e Introducción a la Biofísica",                    cuatriInicial: [1, 2], duracion: "Semestral", horas: "6" },
        { codigo: "CBC-BIOLOGIA_BIOLOGIA_CELULAR", nombre: "Biología e Introducción a la Biología Celular",           cuatriInicial: [1, 2], duracion: "Semestral", horas: "6" },
        { codigo: "CBC-ICSE",                      nombre: "Introducción al Conocimiento de la Sociedad y el Estado", cuatriInicial: [1, 2], duracion: "Semestral", horas: "4" },
        { codigo: "CBC-IPC",                       nombre: "Introducción al Pensamiento Científico",                  cuatriInicial: [1, 2], duracion: "Semestral", horas: "4" },
      ]
    },
    {
      descripcion: "2do año",
      materias: [
        { codigo: "N100", nombre: "Inglés Técnico",                                     cuatriInicial: [1,  2], duracion: "Bimestral", horas: "4" },
        { codigo: "N101", nombre: "Anatomía General y Estomatológica",                  cuatriInicial: 1,       duracion: "Anual",     horas: "8 horas 1er. semestre / 4 horas 2do. semestre" },
        { codigo: "N102", nombre: "Bioquímica General",                                 cuatriInicial: 1,       duracion: "Semestral", horas: "4" },
        { codigo: "N103", nombre: "Histología y Embriología",                           cuatriInicial: 1,       duracion: "Semestral", horas: "8" },
        { codigo: "N105", nombre: "Inmunología y Microbiología I",                      cuatriInicial: 2,       duracion: "Semestral", horas: "4" },
        { codigo: "N106", nombre: "Biología Bucal",                                     cuatriInicial: 2,       duracion: "Semestral", horas: "6 horas 1ra. parte del semestre / 4 horas 2da. parte del semestre" },
        { codigo: "N110", nombre: "Inserción Temprana en la Clínica",                   cuatriInicial: [1,  2], duracion: "Bimestral", horas: "4" },
        { codigo: "N108", nombre: "Biofísica Aplicada a la Práctica Odontológica",      cuatriInicial: 2,       duracion: "Semestral", horas: "4" },
        { codigo: "N111", nombre: "Diagnóstico por Imágenes con Radiofísica Sanitaria", cuatriInicial: 2,       duracion: "Semestral", horas: "4" },
      ]
    },
    {
      descripcion: "3er año",
      materias: [
        { codigo: "N201", nombre: "Fisiología",                                       cuatriInicial: 1, duracion: "Anual",     horas: "8 horas 1er. semestre / 4 horas 2do. semestre" },
        { codigo: "N202", nombre: "Patología General",                                cuatriInicial: 1, duracion: "Semestral", horas: "4" },
        { codigo: "N203", nombre: "Materiales Dentales I",                            cuatriInicial: 1, duracion: "Bimestral", horas: "4" },
        { codigo: "N204", nombre: "Preclínica de Odontología Restauradora I",         cuatriInicial: 1, duracion: "Bimestral", horas: "4" },
        { codigo: "N206", nombre: "Odontología Preventiva y Mínimamente Invasiva I",  cuatriInicial: 1, duracion: "Semestral", horas: "8" },
        { codigo: "N211", nombre: "Preclínica Quirúrgica y Anestesia",                cuatriInicial: 1, duracion: "Bimestral", horas: "4" },
        { codigo: "N205", nombre: "Microbiología II",                                 cuatriInicial: 1, duracion: "Bimestral", horas: "4" },
        { codigo: "N207", nombre: "Odontología Preventiva y Mínimamente Invasiva II", cuatriInicial: 2, duracion: "Semestral", horas: "4" },
        { codigo: "N208", nombre: "Preclínica de Odontología Restauradora II",        cuatriInicial: 2, duracion: "Semestral", horas: "8" },
        { codigo: "N209", nombre: "Endodoncia I",                                     cuatriInicial: 2, duracion: "Semestral", horas: "4" },
        { codigo: "N210", nombre: "Patología Bucal",                                  cuatriInicial: 2, duracion: "Semestral", horas: "4" },
        { codigo: "N212", nombre: "Materiales Dentales II",                           cuatriInicial: 2, duracion: "Semestral", horas: "4" },
        { codigo: "N213", nombre: "Bioética y Ejercicio Profesional",                 cuatriInicial: 2, duracion: "Bimestral", horas: "4" },
        { codigo: "N214", nombre: "Introducción a la Periodoncia",                    cuatriInicial: 2, duracion: "Bimestral", horas: "4" },
      ]
    },
    {
      descripcion: "4to año",
      materias: [
        { codigo: "N302", nombre: "Preclínica de Rehabilitación Protética",           cuatriInicial: 1,      duracion: "Anual",     horas: "8" },
        { codigo: "N303", nombre: "Farmacología",                                     cuatriInicial: 1,      duracion: "Anual",     horas: "4" },
        { codigo: "N304", nombre: "Medicina Interna en la Práctica Odontológica",     cuatriInicial: 1,      duracion: "Anual",     horas: "29 semanas de 4 horas + 5 semanas de 8 horas" },
        { codigo: "N308", nombre: "Endodoncia II",                                    cuatriInicial: 1,      duracion: "Anual",     horas: "4" },
        { codigo: "N309", nombre: "Periodoncia",                                      cuatriInicial: 1,      duracion: "Anual",     horas: "4" },
        { codigo: "N310", nombre: "Odontología Restauradora",                         cuatriInicial: 1,      duracion: "Anual",     horas: "4" },
        { codigo: "N306", nombre: "Bioestadística y Metodología de la Investigación", cuatriInicial: 1,      duracion: "Bimestral", horas: "4" },
        { codigo: "N305", nombre: "Historia de la Odontología",                       cuatriInicial: [1, 2], duracion: "Bimestral", horas: "4" },
        { codigo: "N311", nombre: "Cirugía y Traumatología Bucomaxilofacial I",       cuatriInicial: 1,      duracion: "Anual",     horas: "4" },
      ]
    },
    {
      descripcion: "5to año",
      materias: [
        { codigo: "N401", nombre: "Odontología Rehabilitadora Integral",         cuatriInicial: 1, duracion: "Anual",     horas: "10" },
        { codigo: "N402", nombre: "Cirugía y Traumatología Bucomáxilofacial II", cuatriInicial: 1, duracion: "Anual",     horas: "4" },
        { codigo: "N403", nombre: "Odontología Integral Niños y Adolescentes",   cuatriInicial: 1, duracion: "Anual",     horas: "8" },
        { codigo: "N405", nombre: "Materiales Dentales III",                     cuatriInicial: 1, duracion: "Bimestral", horas: "4" },
        { codigo: "N407", nombre: "Diagnóstico por Imágenes II",                 cuatriInicial: 1, duracion: "Semestral", horas: "4" },
        { codigo: "N404", nombre: "Medicina Bucal I",                            cuatriInicial: 2, duracion: "Semestral", horas: "4" },
        { codigo: "N409", nombre: "Epidemiología y Salud de las Poblaciones",    cuatriInicial: 2, duracion: "Semestral", horas: "3" },
      ]
    },
    {
      descripcion: "6to año",
      materias: [
        { codigo: "N501", nombre: "Odontología Integral Adultos (PPS)",                                       cuatriInicial: 1, duracion: "Anual",     horas: "8" },
        { codigo: "N503", nombre: "Articulación Docencia-Servicio-Investigación (Práctica Social Educativa)", cuatriInicial: 1, duracion: "Anual",     horas: "31 semanas de 4 horas + 3 semanas de 8 horas" },
        { codigo: "N506", nombre: "Ortodoncia I",                                                             cuatriInicial: 1, duracion: "Semestral", horas: "4" },
        { codigo: "N504", nombre: "Medicina Bucal II",                                                        cuatriInicial: 1, duracion: "Semestral", horas: "4" },
        { codigo: "N502", nombre: "Cirugía y Traumatología Bucomáxilofacial III",                             cuatriInicial: 1, duracion: "Anual",     horas: "4" },
        { codigo: "N507", nombre: "Odontología Forense",                                                      cuatriInicial: 1, duracion: "Bimestral", horas: "4" },
        { codigo: "N508", nombre: "Sistema de Salud y Gestión Clínica",                                       cuatriInicial: 2, duracion: "Semestral", horas: "4" },
        { codigo: "N509", nombre: "Odontología Integral para el Adulto Mayor",                                cuatriInicial: 1, duracion: "Anual",     horas: "25 semanas de 4 horas + 9 semanas de 8 horas" },
      ]
    },
    {
      descripcion: "Electivas",
      materias: [
        { codigo: "N601", nombre: "Riesgo Sistémico de la Patología Buco-Dental",             cuatriInicial: null, duracion: "Semestral", horas: "4" },
        { codigo: "N602", nombre: "Atención Odontológica en Pacientes con Discapacidad",      cuatriInicial: null, duracion: "Semestral", horas: "4" },
        { codigo: "N603", nombre: "Ortodoncia II",                                            cuatriInicial: null, duracion: "Semestral", horas: "4" },
        { codigo: "N604", nombre: "Programa Rural de Atención Odontológica",                  cuatriInicial: null, duracion: "Bimestral", horas: "8" },
        { codigo: "N605", nombre: "Traumatismos Dentarios",                                   cuatriInicial: null, duracion: "Semestral", horas: "4" },
        { codigo: "N606", nombre: "Tomografía Computada en la Práctica Clínica Odontológica", cuatriInicial: null, duracion: "Semestral", horas: "4" },
        { codigo: "N607", nombre: "Atención Integral de Pacientes con Sequedad Bucal",        cuatriInicial: null, duracion: "Semestral", horas: "4" },
        { codigo: "N608", nombre: "Módulo Asistencial Integrado de Baja Complejidad",         cuatriInicial: null, duracion: "Semestral", horas: "4" },
        { codigo: "N609", nombre: "Nuevas Tecnologías en Odontología Rehabilitadora",         cuatriInicial: null, duracion: "Semestral", horas: "4" },
        { codigo: "N610", nombre: "Módulo Asistencial de Urgencias Odontológicas",            cuatriInicial: null, duracion: "Semestral", horas: "4" },
      ]
    }
  ],
  correlatividades: {
    "CBC-QUIMICA": [],
    "CBC-MATEMATICA": [],
    "CBC-FISICA_BIOFISICA": [],
    "CBC-BIOLOGIA_BIOLOGIA_CELULAR": [],
    "CBC-ICSE": [],
    "CBC-IPC": [],

    "N100": ["CBC-QUIMICA", "CBC-MATEMATICA", "CBC-FISICA_BIOFISICA", "CBC-BIOLOGIA_BIOLOGIA_CELULAR", "CBC-IPC", "CBC-ICSE"],
    "N101": ["CBC-QUIMICA", "CBC-MATEMATICA", "CBC-FISICA_BIOFISICA", "CBC-BIOLOGIA_BIOLOGIA_CELULAR", "CBC-IPC", "CBC-ICSE"],
    "N102": ["CBC-QUIMICA", "CBC-MATEMATICA", "CBC-FISICA_BIOFISICA", "CBC-BIOLOGIA_BIOLOGIA_CELULAR", "CBC-IPC", "CBC-ICSE"],
    "N103": ["CBC-QUIMICA", "CBC-MATEMATICA", "CBC-FISICA_BIOFISICA", "CBC-BIOLOGIA_BIOLOGIA_CELULAR", "CBC-IPC", "CBC-ICSE"],
    "N105": ["N102", "N103"],
    "N106": ["N102", "N103"],
    "N108": ["N102"],
    "N110": ["CBC-QUIMICA", "CBC-MATEMATICA", "CBC-FISICA_BIOFISICA", "CBC-BIOLOGIA_BIOLOGIA_CELULAR", "CBC-IPC", "CBC-ICSE"],
    "N111": ["N103"],

    "N201": ["N106", "N108"],
    "N202": ["N105", "N106"],
    "N203": ["N108"],
    "N204": ["N101", "N110", "N106"],
    "N206": ["N101", "N105", "N106", "N110", "N111"],
    "N211": ["N101", "N110", "N105"],
    "N205": ["N105"],
    "N207": ["N204", "N206", "N211"],
    "N208": ["N203", "N204", "N206"],
    "N209": ["N204", "N206", "N211"],
    "N210": ["N202"],
    "N212": ["N203"],
    "N213": ["N110"],
    "N214": ["N206"],

    "N302": ["N208", "N212"],
    "N303": ["N201", "N202"],
    "N304": ["N201", "N210", "N110"],
    "N308": ["N205", "N207", "N210", "N208", "N209"],
    "N309": ["N205", "N210", "N207", "N214"],
    "N310": ["N207", "N208", "N212"],
    "N306": ["N100"],
    "N305": ["CBC-QUIMICA", "CBC-MATEMATICA", "CBC-FISICA_BIOFISICA", "CBC-BIOLOGIA_BIOLOGIA_CELULAR", "CBC-IPC", "CBC-ICSE"],
    "N311": ["N205", "N207", "N210", "N211", "N201"],

    "N401": ["N302", "N308", "N309", "N310"],
    "N402": ["N303", "N304", "N311"],
    "N403": ["N303", "N304", "N308", "N309", "N310", "N311"],
    "N405": ["N302", "N310"],
    "N407": ["N311"],
    "N404": ["N304", "N303"],
    "N409": ["N207", "N306"],

    "N501": ["N401", "N402", "N404", "N405"],
    "N502": ["N402", "N404"],
    "N503": ["N403", "N409"],
    "N509": ["N401", "N404"],
    "N506": ["N403", "N407"],
    "N504": ["N404"],
    "N507": ["N213", "N401"],
    "N508": ["N409", "N507"],

    "N601": ["N304"],
    "N602": ["N304"],
    "N603": ["N506"],
    "N604": ["N409", "N403"],
    "N605": ["N308", "N309", "N402"],
    "N606": ["N407"],
    "N607": ["N404"],
    "N608": ["N308", "N310"],
    "N609": ["N302", "N407"],
    "N610": ["N304", "N308"]
  }
}
