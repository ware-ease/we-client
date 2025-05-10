import { Row } from '@tanstack/react-table';

interface HasStatus {
  status: number;
}

interface HasRequestType {
  requestType: number;
}

export const statusMap = [
  { status: 0, label: 'Chờ xử lý', color: 'bg-yellow-500' },
  { status: 1, label: 'Đã đồng ý', color: 'bg-green-400' },
  { status: 2, label: 'Đã từ chối', color: 'bg-red-500' },
  { status: 3, label: 'Hoàn thành', color: 'bg-green-500' },
];

export const requestTypeMap = [
  { type: 0, label: 'Nhập', color: 'bg-blue-500' },
  { type: 1, label: 'Xuất', color: 'bg-orange-500' },
  { type: 2, label: 'Chuyển', color: 'bg-yellow-500' },
  { type: 2, label: 'Trả', color: 'bg-yellow-500' },
];

export const accountStatusMap = [
  { status: 0, label: 'Chưa xác thực', color: 'bg-yellow-500' },
  { status: 1, label: 'Đã xác thực', color: 'bg-green-500' },
  { status: 2, label: 'Đã bị khóa', color: 'bg-red-500' },
];

export const statusFilterFn = <T extends Partial<HasStatus>>(
  row: Row<T>,
  columnId: string,
  filterValue: string
): boolean => {
  const statusValue = row.getValue(columnId);
  const statusInfo = statusMap.find((item) => item.status === statusValue) || {
    label: 'Đã hủy',
    color: 'bg-gray-500',
  };

  return statusInfo.label.toLowerCase().includes(filterValue.toLowerCase());
};

export const requestTypeFilterFn = <T extends Partial<HasRequestType>>(
  row: Row<T>,
  columnId: string,
  filterValue: string
): boolean => {
  const typeValue = row.getValue(columnId);
  const typeInfo = requestTypeMap.find((item) => item.type === typeValue) || {
    label: 'Đã hủy',
    color: 'bg-gray-500',
  };
  return typeInfo.label.toLowerCase().includes(filterValue.toLowerCase());
};

export const accountStatusFilterFn = <T extends Partial<HasStatus>>(
  row: Row<T>,
  columnId: string,
  filterValue: string
): boolean => {
  const statusValue = row.getValue(columnId);
  const statusInfo = accountStatusMap.find(
    (item) => item.status === statusValue
  ) || {
    label: 'Đã bị khóa',
    color: 'bg-red-500',
  };

  return statusInfo.label.toLowerCase().includes(filterValue.toLowerCase());
};
