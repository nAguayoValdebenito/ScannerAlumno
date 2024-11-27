import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * Función para calcular el porcentaje de asistencia.
   * @param totalClases Total de clases registradas para el curso.
   * @param clasesAsistidas Número de clases a las que el estudiante asistió.
   * @returns El porcentaje de asistencia como un número con dos decimales.
   */
  calculateAttendancePercentage(totalClases: number, clasesAsistidas: number): number {
    if (totalClases === 0) return 0; // Si no hay clases registradas, el porcentaje es 0%
    return (clasesAsistidas / totalClases) * 100;
  }

  /**
   * Función para formatear una fecha en formato 'dd/mm/yyyy'.
   * @param date Fecha a formatear.
   * @returns Fecha en formato 'dd/mm/yyyy'.
   */
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Función para validar que un código QR contiene todos los campos necesarios.
   * @param qrData Datos del QR a validar.
   * @param requiredFields Array de los nombres de los campos requeridos.
   * @returns true si todos los campos requeridos están presentes, de lo contrario false.
   */
  validateQRCode(qrData: any, requiredFields: string[]): boolean {
    return requiredFields.every(field => qrData.hasOwnProperty(field));
  }
}
