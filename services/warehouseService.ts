import {
  Inventory,
  Location,
  StockBook,
  StockCard,
  Warehouse,
} from '../types/warehouse';
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
  baseFilters,
} from './baseService';

export const getAllWarehouses = async (): Promise<Warehouse[]> => {
  const response = await axiosGet('/warehouses' + baseFilters, {});
  return response.data.data.records;
};

export const getWarehouseById = async (id: string): Promise<Warehouse> => {
  const response = await axiosGet(`/warehouses/${id}`, {});
  return response.data.data;
};

export const getWarehouseInventoriesById = async (
  id: string
): Promise<Warehouse> => {
  const response = await axiosGet(`/warehouses/${id}/inventory`, {});
  return response.data.data;
};

export const getWarehouseInventoriesByProductId = async (
  warehouseId: string,
  productId: string
): Promise<Inventory[]> => {
  const response = await axiosGet(
    `/inventories` +
      baseFilters +
      `&warehouseId=` +
      warehouseId +
      '&productId=' +
      productId,
    {}
  );
  return response.data.data.records;
};

export const getWarehouseStockCardByProductId = async (
  warehouseId: string,
  productId: string
): Promise<StockCard> => {
  const response = await axiosGet(
    `/warehouses/stock-card` +
      baseFilters +
      `&warehouseId=` +
      warehouseId +
      '&productId=' +
      productId,
    {}
  );
  return response.data.data;
};

export const getWarehouseStockBook = async (
  warehouseId: string,
  month: number,
  year: number
): Promise<StockBook> => {
  const response = await axiosGet(
    `/warehouses/stock-book` +
      `?warehouseId=` +
      warehouseId +
      '&month=' +
      month +
      '&year=' +
      year,
    {}
  );
  return response.data.data;
};

export const getWarehouseInventoryAdjustments = async (
  id: string
): Promise<Warehouse> => {
  const response = await axiosGet(
    `/inventory-adjustments` + baseFilters + '&warehouseId=' + id,
    {}
  );

  return response.data.data;
};

export const createWarehouse = async (
  warehouseData: Partial<Warehouse>
): Promise<Warehouse> => {
  const response = await axiosPost('/warehouses', warehouseData, {});
  return response.data.data;
};

export const updateWarehouse = async (
  id: string,
  warehouseData: Partial<Warehouse>
): Promise<Warehouse> => {
  const response = await axiosPatch(`/warehouses/${id}`, warehouseData, {});
  return response.data.data;
};

export const deleteWarehouse = async (id: string): Promise<void> => {
  await axiosDelete(`/warehouses/${id}`, {});
};

export const createLocation = async (
  location: Partial<{ locations: Location[] }>
) => {
  const response = await axiosPost(
    '/warehouses/' + location.locations?.[0].warehouseId + '/location',
    location,
    {}
  );
  return response.data.data;
};
