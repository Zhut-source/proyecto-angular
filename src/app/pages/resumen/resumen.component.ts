// En: src/app/pages/resumen/resumen.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PredictionService, ComparativeAnalysisInput } from 'src/app/services/prediction.service';

// --- 1. IMPORTA LOS TIPOS NECESARIOS PARA EL GRÁFICO ---
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit, OnDestroy {

  private summarySubscription!: Subscription;

  // Propiedades para las tarjetas
  public kpiTotalLoad: number = 0;
  public kpiGrowthRate: number = 0;
  public kpiTotalClients: number = 0;
  
  public isLoading = true;
  public error: string | null = null;

  // --- 2. DEFINE LAS PROPIEDADES PARA EL GRÁFICO ---
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Consumo (MWh)'
        }
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Consumo Anual (MWh)', backgroundColor: 'rgba(54, 162, 235, 0.6)' }
    ]
  };

  constructor(private predictionService: PredictionService) { }

  ngOnInit(): void {
    this.loadSummaryData();
  }

  loadSummaryData(): void {
    // ... (tu código para definir las fechas y los params) ...
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 3); // Pedimos 3 años de datos para un gráfico más interesante

    const params: ComparativeAnalysisInput = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      historicalComparisonYears: 3,
      includeFuturePredictions: false,
      futurePredictionMonths: 1
    };

    this.summarySubscription = this.predictionService.getComparativeAnalysis(params).subscribe({
      next: (response) => {
        // Asignamos datos a las tarjetas
        this.kpiTotalLoad = response.metadata.totalSystemLoad;
        this.kpiGrowthRate = response.metadata.growthRate;
        this.kpiTotalClients = response.data.systemOverview.totalClients;
        
        // --- 3. LLAMAMOS AL MÉTODO PARA PREPARAR EL GRÁFICO ---
        this.prepareChartData(response.data.yearlyComparisons);


        
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  // --- 4. NUEVO MÉTODO PARA PROCESAR LOS DATOS DEL GRÁFICO ---
  prepareChartData(yearlyData: any[]): void {
    // Ordenamos los datos por año por si vienen desordenados
    const sortedData = yearlyData.sort((a, b) => a.year - b.year);

    // Extraemos las etiquetas (años) y los datos (consumo) usando .map()
    const labels = sortedData.map(item => item.year.toString());
    const data = sortedData.map(item => item.totalEnergyMWh);

    // Actualizamos el objeto de datos del gráfico
    this.barChartData = {
      labels: labels,
      datasets: [
        { 
          data: data, 
          label: 'Consumo Anual (MWh)',
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    };
  }

  ngOnDestroy(): void {
    if (this.summarySubscription) {
      this.summarySubscription.unsubscribe();
    }
  }
}