export type THoursSaved = {
  monthlyAnalytics: TMonthlyAnalytics[];
  overallCostSaved: string;
};
type TMonthlyAnalytics = {
  startDate: string;
  endDate: string;
  averageSavedTimeInSecs: number;
  spashipAverageTimeInSecs: number;
  totalWorkingHours: number;
  totalDeploymentCount: number;
  totalDeploymentHours: number;
  frequencyOfDeployment: number;
  developerHourlyRate: number;
  costSavingPerHour: number;
  totalCostSaved: number;
};
