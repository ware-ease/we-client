import {
  getDashboardCards,
  getDashboardHistogram,
  getDashboardLineChart,
  getDashboardPieChart,
} from '@/services/dashboardService';
import { useQuery } from '@tanstack/react-query';

export const useGetDashboardLineChart = (warehouseId?: string) => {
  return useQuery({
    queryKey: ['dashboardLineChart', warehouseId],
    queryFn: () => getDashboardLineChart(warehouseId),
  });
};

export const useGetDashboardPieChart = (warehouseId?: string) => {
  return useQuery({
    queryKey: ['dashboardPieChart', warehouseId],
    queryFn: () => getDashboardPieChart(warehouseId),
  });
};

export const useGetDashboardHistogram = (
  warehouseId?: string,
  params?: { month?: number; year?: number }
) => {
  return useQuery({
    queryKey: ['dashboardHistogram', warehouseId, params?.month, params?.year],
    queryFn: () => getDashboardHistogram(warehouseId, params),
  });
};

export const useGetDashboardCards = (warehouseId?: string) => {
  return useQuery({
    queryKey: ['dashboardCards', warehouseId],
    queryFn: () => getDashboardCards(warehouseId),
  });
}; 