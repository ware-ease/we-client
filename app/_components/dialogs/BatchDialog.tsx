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
  createBatch,
  deleteBatch,
  getAllBatches,
  updateBatch,
} from '@/lib/services/batchService';
import { Batch } from '@/lib/types/batch';
import { Edit, Search, Trash2, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface BatchDialogProps {
  children: ReactNode;
}
const BatchDialog = ({ children }: BatchDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<Batch[]>([]);
  const [newBatch, setNewBatch] = useState<Partial<Batch>>({
    code: '',
    name: '',
    mfgDate: '',
    expDate: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingBatch, setEditingBatch] = useState<string | null>(null);
  const [editedBatch, setEditedBatch] = useState<Partial<Batch>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);

  useEffect(() => {
    if (open) fetchBatches();
  }, [open]);

  const fetchBatches = async () => {
    try {
      const data = await getAllBatches();
      setBatches(data);
      setFilteredBatches(data);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách lô hàng.');
    }
  };

  // const handleAddBatch = async () => {
  //   if (!newBatch.code?.trim() || !newBatch.name?.trim()) {
  //     toast.error('Vui lòng nhập thông tin lô hàng hợp lệ.');
  //     return;
  //   }
  //   try {
  //     const createdBatch = await createBatch(newBatch);
  //     setBatches([...batches, createdBatch]);
  //     // setFilteredBatches([...batches, createdBatch]);
  //     setNewBatch({ code: '', name: '', mfgDate: '', expDate: '' });
  //     setShowForm(false);
  //     toast.success('Thêm lô hàng thành công!');
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Không thể thêm lô hàng.');
  //   }
  // };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredBatches(
      batches.filter((batch) =>
        batch.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleEditBatch = (batch: Batch) => {
    setNewBatch(batch); // Gán batch hiện tại vào newBatch để chỉnh sửa
    setShowForm(true); // Hiển thị form
  };

  const handleSaveBatch = async () => {
    if (!newBatch.code?.trim() || !newBatch.name?.trim()) {
      toast.error('Vui lòng nhập thông tin lô hàng hợp lệ.');
      return;
    }

    try {
      if (newBatch.id) {
        // Nếu có ID, tức là đang chỉnh sửa
        await updateBatch(newBatch.id, newBatch);
        setBatches(
          batches.map((batch) =>
            batch.id === newBatch.id ? { ...batch, ...newBatch } : batch
          )
        );
        toast.success('Cập nhật lô hàng thành công!');
      } else {
        // Nếu không có ID, tức là đang tạo mới
        const createdBatch = await createBatch(newBatch);
        setBatches([...batches, createdBatch]);
        toast.success('Thêm lô hàng thành công!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Không thể lưu lô hàng.');
    }

    // Reset form sau khi lưu
    setNewBatch({ code: '', name: '', mfgDate: '', expDate: '' });
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingBatch(null);
    setEditedBatch({});
  };

  const handleDeleteBatch = async () => {
    if (!batchToDelete) return;
    try {
      await deleteBatch(batchToDelete.id!);
      const updatedBatches = batches.filter(
        (batch) => batch.id !== batchToDelete.id
      );
      setBatches(updatedBatches);
      setFilteredBatches(updatedBatches);
      toast.success('Xóa lô hàng thành công!');
    } catch (error) {
      console.error(error);
      toast.error('Không thể xóa lô hàng.');
    } finally {
      setDeleteDialogOpen(false);
      setBatchToDelete(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quản lý lô hàng</DialogTitle>
        </DialogHeader>

        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <div>
              <Label className='text-red-600'>Mã lô hàng *</Label>
              <Input
                value={newBatch.code}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, code: e.target.value })
                }
                className='bg-white'
              />
            </div>
            <div>
              <Label className='text-red-600'>Tên lô hàng *</Label>
              <Input
                value={newBatch.name}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, name: e.target.value })
                }
                className='bg-white'
              />
            </div>
            <div>
              <Label>Ngày sản xuất</Label>
              <Input
                type='date'
                value={newBatch.mfgDate}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, mfgDate: e.target.value })
                }
                className='bg-white'
              />
            </div>
            <div>
              <Label>Ngày hết hạn</Label>
              <Input
                type='date'
                value={newBatch.expDate}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, expDate: e.target.value })
                }
                className='bg-white'
              />
            </div>
            <div className='flex justify-end mt-3 space-x-2'>
              <Button onClick={handleSaveBatch}>
                {newBatch.id ? 'Lưu thay đổi' : 'Lưu và chọn'}
              </Button>
              <Button
                variant='secondary'
                onClick={() => {
                  setNewBatch({ code: '', name: '', mfgDate: '', expDate: '' });
                  setShowForm(false);
                }}
              >
                Hủy
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className='w-full bg-green-500 text-white'
            onClick={() => setShowForm(true)}
          >
            + Tạo lô hàng mới
          </Button>
        )}

        <div className='relative'>
          <Search className='absolute left-3 top-2.5 text-gray-400' size={16} />
          <Input
            type='text'
            placeholder='Tìm kiếm lô hàng...'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-9'
          />
        </div>
        <div className='border rounded-md p-3 max-h-60 overflow-auto'>
          <h3 className='text-sm font-semibold text-gray-600'>
            Danh sách lô hàng
          </h3>
          <ul className='mt-2 space-y-2'>
            {filteredBatches.length > 0 ? (
              filteredBatches.map((batch, index) => (
                <li
                  key={batch.id}
                  className='flex justify-between items-center p-2 border rounded-md transition-all duration-300 hover:bg-gray-100'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {editingBatch === batch.id ? (
                    <div className='flex items-center space-x-2 w-full'>
                      <Input
                        value={editedBatch.name || ''}
                        onChange={(e) =>
                          setEditedBatch({
                            ...editedBatch,
                            name: e.target.value,
                          })
                        }
                        className='flex-1'
                      />
                      {/* <Check
                        className='text-green-600 h-5 w-5 cursor-pointer'
                        onClick={() => handleSaveEdit(batch.id)}
                      /> */}
                      <X
                        className='text-gray-600 h-5 w-5 cursor-pointer'
                        onClick={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <>
                      <span className='text-gray-700'>{batch.name}</span>
                      {hoveredIndex === index && (
                        <div className='flex space-x-2'>
                          <Edit
                            className='text-blue-600 h-4 w-4 cursor-pointer'
                            onClick={() => handleEditBatch(batch)}
                          />

                          <Trash2
                            className='text-red-600 h-4 w-4 cursor-pointer'
                            onClick={() => {
                              setBatchToDelete(batch);
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
                Không có lô hàng nào.
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
              Bạn có chắc chắn muốn xóa lô hàng &quot;
              {batchToDelete?.name}&quot; không?
            </p>
            <DialogFooter>
              <Button variant='destructive' onClick={handleDeleteBatch}>
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

export default BatchDialog;
