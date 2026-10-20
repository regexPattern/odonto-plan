import { PLAN } from "./index.js";

export function validarCambioCalificacion(
  codigo: string,
  calificacion: number,
  codigosAprobados: ReadonlySet<string>,
  correlatividades: Record<string, string[]> = PLAN.correlatividades,
): string | null {
  if (!Number.isInteger(calificacion) || calificacion < 0 || calificacion > 10) {
    return "La calificación debe ser un número entero entre 0 y 10.";
  }

  if (calificacion >= 4) {
    if (!(correlatividades[codigo] ?? []).every((codigo) => codigosAprobados.has(codigo))) {
      return "No se puede aprobar esta materia hasta aprobar todas sus correlativas.";
    }
  } else if (
    codigosAprobados.has(codigo) &&
    Object.entries(correlatividades).some(
      ([dependiente, requisitos]) =>
        codigosAprobados.has(dependiente) && requisitos.includes(codigo),
    )
  ) {
    return "Todavía hay materias correlativas aprobadas que dependen de esta materia. No se puede desaprobar.";
  }

  return null;
}
