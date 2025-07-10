export interface ComparativeAnalysisResponse {
  systemOverview: {
    totalClients: number;
    totalRevenue: number;
    // ... otros campos si los necesitas ...
  };

  yearlyComparisons: { year: number, totalEnergyMWh: number }[];
  // ... otras propiedades que puedas necesitar para gráficos ...
}

// Esta interfaz modela el contenido del campo 'metadata'
export interface ComparativeAnalysisMetadata {
  totalSystemLoad: number;
  growthRate: number;
  dataQuality: string;
  // ... otros campos ...
}