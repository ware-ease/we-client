import { Supplier } from '@/types/supplier';
import { axiosGet, baseFilters } from './baseService';

export const getAllPartners = async (
  partnerType: number
): Promise<Supplier[]> => {
  const response = await axiosGet(
    '/partners' + baseFilters + '&partnerType=' + partnerType,
    {}
  );
  return response.data.data.records;
};
