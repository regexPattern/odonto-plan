import { describe, expect, it } from "vitest";
import { codificar, crearEnlace, decodificar, LONGITUD_CODIGO, MATERIAS } from "./codigo.js";

const todas = MATERIAS.map(({ codigo }, i) => ({ codigo, calificacion: 4 + (i % 7) }));
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

describe("código de progreso", () => {
  it("mantiene el orden del plan y el formato (el código depende de ambos)", () => {
    // Si este test falla, los códigos ya compartidos dejarían de ser compatibles.
    expect(MATERIAS.length).toBe(63);
    expect(MATERIAS[0].codigo).toBe("CBC-QUIMICA");
    expect(codificar([])).toBe("CSPOvEGSNvZWlztvA9L36UlX1kgOTRCSaIK");
    expect(codificar([{ codigo: "CBC-QUIMICA", calificacion: 10 }])).toBe(
      "6SPOvEGSNvZWlztvA9L36UlX1kgOTRCSv5T",
    );
    expect(codificar([{ codigo: MATERIAS[62].codigo, calificacion: 4 }])).toBe(
      "CSPOvEGSNvZWlztvA9L36UlX1kgOTRCaep0",
    );
    expect(codificar(todas)).toBe("IOh38hxYRBgFAEnzuEYSNe55M3F5ZNsqg24");
  });

  it.each([
    ["vacío", []],
    ["parcial", todas.filter((_, i) => i % 3 === 0)],
    ["completo", todas],
  ])("ida y vuelta: %s", (_, estado) => {
    const codigo = codificar(estado);
    expect(codigo).toHaveLength(LONGITUD_CODIGO);
    expect(decodificar(codigo)).toEqual(estado);
  });

  it("no se ve como una repetición de caracteres, ni siquiera vacío", () => {
    for (const estado of [[], todas.slice(0, 5)]) {
      expect(codificar(estado)).not.toMatch(/(.)\1{2,}/);
    }
  });

  it("acepta espacios y un enlace completo", () => {
    const codigo = codificar(todas);
    const enlace = crearEnlace(codigo, new URL("https://odonto.example/app/"));
    expect(enlace).toBe(`https://odonto.example/app/#p=${codigo}`);
    expect(decodificar(` ${codigo}\n`)).toEqual(todas);
    expect(decodificar(enlace)).toEqual(todas);
  });

  it("detecta cualquier carácter cambiado (error de copia)", () => {
    const codigo = codificar(todas);
    for (let i = 0; i < codigo.length; i++) {
      for (const c of ALFABETO.replace(codigo[i], "")) {
        expect(() => decodificar(codigo.slice(0, i) + c + codigo.slice(i + 1))).toThrow();
      }
    }
  });

  it.each(["", "abc", "A".repeat(34), "A".repeat(36), codificar([]).slice(0, -1) + "!"])(
    "rechaza %j",
    (texto) => {
      expect(() => decodificar(texto)).toThrow(/no es válido/);
    },
  );
});
