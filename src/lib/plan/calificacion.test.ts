import { describe, expect, it } from "vitest";
import { validarCambioCalificacion } from "./calificacion.js";

const correlatividades = { A: [], B: ["A"], C: ["A", "B"] };
const validar = (codigo: string, nota: number, aprobadas: string[]) =>
  validarCambioCalificacion(codigo, nota, new Set(aprobadas), correlatividades);

describe("cambios de calificación", () => {
  it("permite aprobar materias sin requisitos o con todos aprobados", () => {
    expect(validar("A", 4, [])).toBeNull();
    expect(validar("C", 10, ["A", "B"])).toBeNull();
  });

  it("impide aprobar si falta alguna correlativa", () => {
    expect(validar("C", 4, ["A"])).toContain("todas sus correlativas");
    expect(validar("B", 10, [])).not.toBeNull();
  });

  it("impide desaprobar si hay materias aprobadas dependientes", () => {
    for (const nota of [0, 1, 2, 3]) {
      expect(validar("A", nota, ["A", "B"])).toContain("No se puede desaprobar");
    }
  });

  it("permite cambiar una nota aprobada y quitar aprobaciones en orden inverso", () => {
    expect(validar("A", 7, ["A", "B"])).toBeNull();
    expect(validar("B", 0, ["A", "B"])).toBeNull();
    expect(validar("A", 3, ["A"])).toBeNull();
  });

  it("permite notas insuficientes en materias bloqueadas", () => {
    expect(validar("C", 2, [])).toBeNull();
  });

  it("rechaza valores fuera de la escala y pasos no enteros", () => {
    for (const nota of [-1, 11, 4.5, NaN]) {
      expect(validar("A", nota, [])).not.toBeNull();
    }
  });
});
