import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { claveVersionada, guardarPersistido, leerPersistido, STORAGE_VERSION } from "./storage.js";

describe("persistencia versionada", () => {
  let datos: Map<string, string>;

  beforeEach(() => {
    datos = new Map();
    vi.stubGlobal("localStorage", {
      getItem: (clave: string) => datos.get(clave) ?? null,
      setItem: (clave: string, valor: string) => datos.set(clave, valor),
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it("escribe y lee usando la versión actual", () => {
    guardarPersistido("progreso", "[]");
    expect(datos.get(`progreso:v${STORAGE_VERSION}`)).toBe("[]");
    expect(datos.has("progreso")).toBe(false);
    expect(leerPersistido("progreso")).toBe("[]");
  });

  it("devuelve null cuando no hay datos", () => {
    expect(leerPersistido("progreso")).toBeNull();
  });

  it("migra los datos sin versión únicamente a v1", () => {
    datos.set("progreso", '["1"]');
    expect(leerPersistido("progreso", 1)).toBe('["1"]');
    expect(datos.get("progreso:v1")).toBe('["1"]');
  });

  it("prioriza la versión solicitada incluso si contiene un string vacío", () => {
    datos.set("progreso", "antiguo");
    datos.set("progreso:v1", "");
    expect(leerPersistido("progreso", 1)).toBe("");
  });

  it("ignora versiones incompatibles y datos sin versión sin borrar nada", () => {
    datos.set("progreso", "original");
    datos.set("progreso:v1", "anterior");
    datos.set("otra-app", "ajeno");
    const original = new Map(datos);
    expect(leerPersistido("progreso", 2)).toBeNull();
    expect(datos).toEqual(original);
    datos.set("progreso:v2", "nuevo");
    expect(leerPersistido("progreso", 2)).toBe("nuevo");
  });

  it("permite generar claves de una versión concreta", () => {
    expect(claveVersionada("paleta", 2)).toBe("paleta:v2");
  });

  it("mantiene la versión de la paleta inicial sincronizada", () => {
    const html = readFileSync(new URL("../app.html", import.meta.url), "utf8");
    expect(html).toContain(`const version = ${STORAGE_VERSION};`);
  });
});
