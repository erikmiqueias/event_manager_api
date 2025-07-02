// Converte horas para minutos
function hoursToMinutes(hours: number) {
  return hours * 60;
}

// Converte dias para minutos
function daysToMinutes(days: number) {
  return days * 24 * 60;
}

export function convertToMinutes(duration: number, unit: string) {
  switch (unit) {
    case "minutos":
      return duration;
    case "horas":
      return hoursToMinutes(duration);
    case "dias":
      return daysToMinutes(duration);
    default:
      throw new Error("Unidade inválida");
  }
}
