import plan from "./plan.json";

export type Plan = {
  anios: AnioPlan[];
  correlatividades: {
    [codigoMateria: string]: string[];
  };
};

export type AnioPlan = {
  descripcion: string;
  materias: MateriaPlan[];
};

export type MateriaPlan = {
  codigo: string;
  nombre: string;
  cuatriInicial: (1 | 2) | [1, 2] | null;
  duracion: "Bimestral" | "Semestral" | "Anual";
  horas: string;
};

export const PLAN = plan as Plan;
