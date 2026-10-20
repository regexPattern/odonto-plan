import { PLAN } from "../plan/index.js";

export const MATERIAS = PLAN.anios.flatMap(({ materias }) => materias);
export const PREFIJO_FRAGMENTO = "#p=";

// El código es el progreso en una sola cadena: una materia = 3 bits (0 = sin aprobar,
// 1..7 = nota 4..10), dos materias por carácter base64url (32 con 63 materias).
// Se codifica por POSICIÓN en plan.json: si el plan cambia, solo agregar materias al final.
//
// Cosmético, no es cifrado: cada carácter se mezcla (XOR) con una secuencia fija para que
// el código no se vea como "AAAA…", y se agregan CONTROL caracteres de integridad
// para detectar errores de copia.
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const LONGITUD_DATOS = Math.ceil(MATERIAS.length / 2);
const CONTROL = 3;
export const LONGITUD_CODIGO = LONGITUD_DATOS + CONTROL;

// mulberry32 con semilla fija: mismo resultado en todos los dispositivos.
const MEZCLA = (() => {
  let s = 0x0d0710;
  return Array.from({ length: LONGITUD_DATOS }, () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return (t ^ (t >>> 14)) & 63;
  });
})();

// FNV-1a, 18 bits bajos. Cambiar un solo carácter siempre cambia el resultado.
function control(datos: string): string {
  let hash = 0x811c9dc5;
  for (const caracter of datos) hash = Math.imul(hash ^ caracter.charCodeAt(0), 0x01000193);
  const bits = hash & 0x3ffff;
  return ALFABETO[bits >> 12] + ALFABETO[(bits >> 6) & 63] + ALFABETO[bits & 63];
}

type MateriaAprobada = { codigo: string; calificacion: number };

export function codificar(aprobadas: readonly MateriaAprobada[]): string {
  const notas = new Map(aprobadas.map(({ codigo, calificacion }) => [codigo, calificacion]));
  const valor = (i: number) => {
    const nota = notas.get(MATERIAS[i]?.codigo ?? "");
    return nota === undefined ? 0 : nota - 3;
  };
  let datos = "";
  for (let i = 0; i < LONGITUD_DATOS; i++) {
    datos += ALFABETO[(valor(i * 2) * 8 + valor(i * 2 + 1)) ^ MEZCLA[i]];
  }
  return datos + control(datos);
}

// Acepta el código solo o un enlace completo pegado.
export function decodificar(texto: string): MateriaAprobada[] {
  const codigo = texto.trim().replace(/^.*#p=/s, "");
  if (codigo.length !== LONGITUD_CODIGO || [...codigo].some((c) => !ALFABETO.includes(c))) {
    throw new Error("El código no es válido. Revisá que esté completo y copiado sin cambios.");
  }
  const datos = codigo.slice(0, LONGITUD_DATOS);
  if (control(datos) !== codigo.slice(LONGITUD_DATOS)) {
    throw new Error("El código tiene un error de copia. Volvé a copiarlo completo.");
  }
  return [...datos].flatMap((caracter, i) => {
    const par = ALFABETO.indexOf(caracter) ^ MEZCLA[i];
    return [par >> 3, par & 7].flatMap((valor, j) => {
      const materia = MATERIAS[i * 2 + j];
      return valor && materia ? [{ codigo: materia.codigo, calificacion: valor + 3 }] : [];
    });
  });
}

export const crearEnlace = (codigo: string, url: Pick<URL, "origin" | "pathname">) =>
  `${url.origin}${url.pathname}${PREFIJO_FRAGMENTO}${codigo}`;
