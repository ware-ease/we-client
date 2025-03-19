'use client';

import { Button } from '@/app/_components/shadcn-base/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/shadcn-base/Dialog';
import { Input } from '@/app/_components/shadcn-base/Input';
import { Label } from '@/app/_components/shadcn-base/Label';
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  updateCustomer,
} from '@/lib/services/customerService';
import { Customer } from '@/lib/types/customer';
import { Check, Edit, Search, Trash2, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface CustomerDialogProps {
  children: ReactNode;
}

const CustomerDialog = ({ children }: CustomerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );

  useEffect(() => {
    if (open) fetchCustomers();
  }, [open]);

  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khách hàng:', error);
      toast.error('Không thể tải danh sách khách hàng.');
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.trim()) {
      toast.error('Vui lòng nhập tên khách hàng hợp lệ.');
      return;
    }

    try {
      const createdCustomer = await createCustomer({ name: newCustomer });
      setCustomers([...customers, createdCustomer]);
      setFilteredCustomers([...customers, createdCustomer]);
      setNewCustomer('');
      setShowForm(false);
      toast.success('Thêm khách hàng thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm khách hàng:', error);
      toast.error('Không thể thêm khách hàng.');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredCustomers(
      customers.filter((customer) =>
        customer.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer.id);
    setEditedName(customer.name);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateCustomer(id, { name: editedName });
      const updatedCustomers = customers.map((customer) =>
        customer.id === id ? { ...customer, name: editedName } : customer
      );
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      setEditingCustomer(null);
      toast.success('Cập nhật khách hàng thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật khách hàng:', error);
      toast.error('Không thể cập nhật khách hàng.');
    }
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
    setEditedName('');
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    try {
      await deleteCustomer(customerToDelete?.id || '');
      const updatedCustomers = customers.filter(
        (customer) => customer.id !== customerToDelete.id
      );
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      toast.success('Xóa khách hàng thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa khách hàng:', error);
      toast.error('Không thể xóa khách hàng.');
    } finally {
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='w-full max-w-md bg-white p-6 rounded-lg shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>
            Quản lý khách hàng
          </DialogTitle>
        </DialogHeader>

        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <Label htmlFor='customer-name' className='text-red-600'>
              Tên khách hàng*
            </Label>
            <Input
              id='customer-name'
              value={newCustomer}
              onChange={(e) => setNewCustomer(e.target.value)}
              placeholder='Enter customer name...'
              className='mt-1'
            />
            <div className='flex justify-end mt-3 space-x-2'>
              <Button
                className='bg-blue-500 text-white'
                onClick={handleAddCustomer}
              >
                Lưu và Chọn
              </Button>
              <Button variant='secondary' onClick={() => setShowForm(false)}>
                Đóng
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className='w-full bg-green-500 text-white mb-3'
            onClick={() => setShowForm(true)}
          >
            + Tạo khách hàng mới
          </Button>
        )}

        {/* Tìm kiếm */}
        <div className='relative mb-3'>
          <Search className='absolute left-3 top-3 text-gray-400 h-4 w-4' />
          <Input
            type='text'
            placeholder='Tìm kiếm khách hàng...'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-9'
          />
        </div>

        {/* Danh sách khách hàng */}
        <div className='border rounded-md p-3 max-h-60 overflow-auto'>
          <h3 className='text-sm font-semibold text-gray-600'>
            Danh sách khách hàng
          </h3>
          <ul className='mt-2 space-y-2'>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <li
                  key={customer.id}
                  className='flex justify-between items-center p-2 border rounded-md transition-all duration-300 hover:bg-gray-100'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {editingCustomer === customer.id ? (
                    <div className='flex items-center space-x-2 w-full'>
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className='flex-1'
                      />
                      <Check
                        className='text-green-600 h-5 w-5 cursor-pointer'
                        onClick={() => handleSaveEdit(customer.id)}
                      />
                      <X
                        className='text-gray-600 h-5 w-5 cursor-pointer'
                        onClick={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <>
                      <span className='text-gray-700'>{customer.name}</span>
                      {hoveredIndex === index && (
                        <div className='flex space-x-2'>
                          <Edit
                            className='text-blue-600 h-4 w-4 cursor-pointer'
                            onClick={() => handleEditCustomer(customer)}
                          />
                          <Trash2
                            className='text-red-600 h-4 w-4 cursor-pointer'
                            onClick={() => {
                              setCustomerToDelete(customer);
                              setDeleteDialogOpen(true);
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))
            ) : (
              <p className='text-gray-500 text-sm text-center'>
                Không có khách hàng nào.
              </p>
            )}
          </ul>
        </div>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className='max-w-sm bg-white p-5 rounded-lg shadow-lg'>
            <DialogHeader>
              <DialogTitle className='text-red-600'>Xác nhận xóa</DialogTitle>
            </DialogHeader>
            <p>
              Bạn có chắc chắn muốn xóa khách hàng &quot;
              {customerToDelete?.name}&quot; không?
            </p>
            <DialogFooter>
              <Button variant='destructive' onClick={handleDeleteCustomer}>
                Xóa
              </Button>
              <DialogClose asChild>
                <Button variant='secondary'>Hủy</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant='secondary'
              className='px-4 py-2 hover:bg-slate-200'
            >
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
