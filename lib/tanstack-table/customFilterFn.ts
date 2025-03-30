import { Row } from '@tanstack/react-table';

interface HasStatus {
  status: string;
}

export const statusMap = [
  { status: 0, label: 'Chờ xử lý', color: 'bg-yellow-500' },
  { status: 1, label: 'Hoàn thành', color: 'bg-green-500' },
  { status: 2, label: 'Đã hủy', color: 'bg-red-500' },
  { status: 3, label: 'Thất bại', color: 'bg-orange-500' },
];

export const statusFilterFn = <T extends Partial<HasStatus>>(
  row: Row<T>,
  columnId: string,
  filterValue: string
): boolean => {
  const statusValue = row.getValue(columnId);
  const statusInfo = statusMap.find((item) => item.status === statusValue) || {
    label: 'Không xác định',
    color: 'bg-gray-500',
  };

  return statusInfo.label.toLowerCase().includes(filterValue.toLowerCase());
};
