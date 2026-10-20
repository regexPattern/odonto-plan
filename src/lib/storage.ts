// Incrementar ante cambios incompatibles en los datos persistidos.
// Mantener sincronizada la versión del script de paleta en src/app.html.
export const STORAGE_VERSION: number = 1;

export const claveVersionada = (clave: string, version = STORAGE_VERSION): string =>
  `${clave}:v${version}`;

export const leerPersistido = (clave: string, version = STORAGE_VERSION): string | null => {
  const claveActual = claveVersionada(clave, version);
  const valor = localStorage.getItem(claveActual);
  if (valor !== null || version !== 1) return valor;

  // Solo v1 admite el formato original sin versión. Nunca recuperar datos
  // antiguos después de incrementar la versión por un cambio incompatible.
  const anterior = localStorage.getItem(clave);
  if (anterior !== null) localStorage.setItem(claveActual, anterior);
  return anterior;
};

export const guardarPersistido = (clave: string, valor: string): void => {
  localStorage.setItem(claveVersionada(clave), valor);
};
