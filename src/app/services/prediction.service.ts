// En: src/app/services/prediction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ComparativeAnalysisResponse } from '../models/prediction.model'; // Y este también
import { ApiResponse } from '../models/api.model';

// Interfaz para los parámetros de entrada del análisis
export interface ComparativeAnalysisInput {
  startDate: string; // Formato YYYY-MM-DD
  endDate: string;   // Formato YYYY-MM-DD
  historicalComparisonYears: number;
  includeFuturePredictions: boolean;
  futurePredictionMonths: number;
}

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  private baseUrl = 'https://localhost:7118/api/v1/Predictions';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el análisis comparativo completo del sistema eléctrico.
   * Ideal para el resumen gerencial.
   * @param params Objeto con las fechas y opciones para el análisis.
   */
  getComparativeAnalysis(params: ComparativeAnalysisInput): Observable<ApiResponse<ComparativeAnalysisResponse>> {
    const url = `${this.baseUrl}/comparative-analysis`;
    return this.http.post<ApiResponse<ComparativeAnalysisResponse>>(url, params).pipe(
      catchError(this.handleError)
    );
  }

  // Puedes añadir aquí los otros métodos (getEnergyDemand, getConsumptionByGroup, etc.) en el futuro

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error al procesar la solicitud.';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error del servidor: ${error.status}.`;
    }
    console.error(`[PredictionService] Error: ${errorMessage}`, error);
    return throwError(() => new Error(errorMessage));
  }
}