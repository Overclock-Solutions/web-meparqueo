// Función helper para extraer mensajes de error de forma centralizada.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractErrorMessage = (error: any): string => {
  if (error.response && error.response.data) {
    const data = error.response.data;
    // Si viene un array de errores, lo concatenamos.
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.join(', ');
    }
    // Si no, devolvemos el mensaje o un fallback.
    return data.message || error.message || 'Error inesperado';
  }
  return error.message || 'Error inesperado';
};
