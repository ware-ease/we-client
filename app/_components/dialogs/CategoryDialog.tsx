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
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from '@/lib/services/categoryService';
import { Category } from '@/lib/types/category';
import { Check, Edit, Search, Trash2, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface CategoryDialogProps {
  children: ReactNode;
}

const CategoryDialog = ({ children }: CategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  useEffect(() => {
    if (open) fetchCategories();
  }, [open]);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error('', error);
      toast.error('Không thể tải danh sách danh mục.');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Vui lòng nhập tên danh mục hợp lệ.');
      return;
    }
    try {
      const createdCategory = await createCategory({ name: newCategory });
      setCategories([...categories, createdCategory]);
      setFilteredCategories([...categories, createdCategory]);
      setNewCategory('');
      setShowForm(false);
      toast.success('Thêm danh mục thành công!');
    } catch (error) {
      console.error('', error);
      toast.error('Không thể thêm danh mục.');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredCategories(
      categories.filter((category) =>
        category.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category.id);
    setEditedName(category.name);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateCategory(id, { name: editedName });
      setCategories(
        categories.map((category) =>
          category.id === id ? { ...category, name: editedName } : category
        )
      );
      setFilteredCategories(
        categories.map((category) =>
          category.id === id ? { ...category, name: editedName } : category
        )
      );
      setEditingCategory(null);
      toast.success('Cập nhật danh mục thành công!');
    } catch (error) {
      console.error('', error);
      toast.error('Không thể cập nhật danh mục.');
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditedName('');
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id);
      const updatedCategories = categories.filter(
        (category) => category.id !== categoryToDelete.id
      );
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
      toast.success('Xóa danh mục thành công!');
    } catch (error) {
      console.error('', error);
      toast.error('Không thể xóa danh mục.');
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='w-full max-w-md bg-white p-6 rounded-lg shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>
            Quản lý danh mục
          </DialogTitle>
        </DialogHeader>

        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <Label>Tên danh mục*</Label>
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder='Nhập tên danh mục...'
            />
            <div className='flex justify-end mt-3 space-x-2'>
              <Button onClick={handleAddCategory}>Lưu và Chọn</Button>
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
            + Tạo danh mục mới
          </Button>
        )}

        <div className='relative mb-3'>
          <Search className='absolute left-3 top-3 text-gray-400 h-4 w-4' />
          <Input
            type='text'
            placeholder='Tìm kiếm danh mục...'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-9'
          />
        </div>

        <div className='border rounded-md p-3 max-h-60 overflow-auto'>
          <h3 className='text-sm font-semibold text-gray-600'>
            Danh sách danh mục
          </h3>
          <ul className='mt-2 space-y-2'>
            {filteredCategories.map((category, index) => (
              <li
                key={category.id}
                className='flex justify-between items-center p-2 border rounded-md hover:bg-gray-100'
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {editingCategory === category.id ? (
                  <div className='flex items-center space-x-2 w-full'>
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className='flex-1'
                    />
                    <Check
                      onClick={() => handleSaveEdit(category.id)}
                      className='text-green-600 h-5 w-5 cursor-pointer'
                    />
                    <X
                      onClick={handleCancelEdit}
                      className='text-gray-600 h-5 w-5 cursor-pointer'
                    />
                  </div>
                ) : (
                  <>
                    <span className='text-gray-700'>{category.name}</span>
                    {hoveredIndex === index && (
                      <div className='flex space-x-2'>
                        <Edit
                          onClick={() => handleEditCategory(category)}
                          className='text-blue-600 h-4 w-4 cursor-pointer'
                        />
                        <Trash2
                          onClick={() => {
                            setCategoryToDelete(category);
                            setDeleteDialogOpen(true);
                          }}
                          className='text-red-600 h-4 w-4 cursor-pointer'
                        />
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className='max-w-sm bg-white p-5 rounded-lg shadow-lg'>
            <DialogHeader>
              <DialogTitle className='text-red-600'>Xác nhận xóa</DialogTitle>
            </DialogHeader>
            <p>
              Bạn có chắc chắn muốn xóa danh mục &quot;
              {categoryToDelete?.name}&quot; không?
            </p>
            <DialogFooter>
              <Button variant='destructive' onClick={handleDeleteCategory}>
                Xóa
              </Button>
              <DialogClose asChild>
                <Button variant='secondary'>Hủy</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
