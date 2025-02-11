'use client';

import { Button } from '@/app/_components/shadcn-base/Button';
import { Checkbox } from '@/app/_components/shadcn-base/Checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/_components/shadcn-base/Dialog';
import { Input } from '@/app/_components/shadcn-base/Input';
import { Label } from '@/app/_components/shadcn-base/Label';
import { ScrollArea } from '@/app/_components/shadcn-base/ScrollArea';
import {
  Check,
  Edit,
  List,
  Plus,
  SortAsc,
  SortDesc,
  Trash,
  Users,
} from 'lucide-react';
import { useState } from 'react';

const initialGroups = [
  'Admin',
  'HR',
  'Finance',
  'IT',
  'Marketing',
  'Sales',
  'Customer Support',
];
const initialAccounts = [
  'Alice',
  'Bob',
  'Charlie',
  'David',
  'Eve',
  'Frank',
  'Grace',
];

const permissions = [
  { name: 'View Payroll', category: 'HR' },
  { name: 'Edit Payroll', category: 'HR' },
  { name: 'View Employees', category: 'HR' },
  { name: 'Approve Leave', category: 'HR' },
  { name: 'Manage Inventory', category: 'Finance' },
  { name: 'Access Financial Reports', category: 'Finance' },
];

const Permissions = () => {
  const [activeTab, setActiveTab] = useState<'Groups' | 'Accounts'>('Groups');
  const [groups, setGroups] = useState(initialGroups);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [selectedItem, setSelectedItem] = useState(groups[0] || '');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [editItem, setEditItem] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [deleteItemName, setDeleteItemName] = useState<string | null>(null);

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const addItem = () => {
    setNewItemName('');
    setIsDialogOpen(true);
  };

  const confirmAddItem = () => {
    if (newItemName.trim()) {
      if (activeTab === 'Groups' && !groups.includes(newItemName)) {
        setGroups([...groups, newItemName]);
      } else if (activeTab === 'Accounts' && !accounts.includes(newItemName)) {
        setAccounts([...accounts, newItemName]);
      }
      setSelectedItem(newItemName);
    }
    setIsDialogOpen(false);
  };

  const handleOpenDeleteDialog = (item: string) => {
    setDeleteItemName(item);
  };

  const handleConfirmDelete = () => {
    if (!deleteItemName) return;

    if (activeTab === 'Groups') {
      setGroups(groups.filter((g) => g !== deleteItemName));
    } else {
      setAccounts(accounts.filter((a) => a !== deleteItemName));
    }

    setSelectedItem('');
    setDeleteItemName(null);
  };

  const filteredItems = (activeTab === 'Groups' ? groups : accounts)
    .filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) =>
      sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
    );

  return (
    <div className='flex h-screen p-6 bg-gray-100'>
      {/* Sidebar */}
      <div className='w-1/4 bg-white shadow-lg rounded-lg p-4'>
        {/* Tabs */}
        <div className='flex gap-2 mb-4'>
          <Button
            variant={activeTab === 'Groups' ? 'default' : 'outline'}
            onClick={() => setActiveTab('Groups')}
          >
            <List className='h-5 w-5 mr-1' /> Groups
          </Button>
          <Button
            variant={activeTab === 'Accounts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('Accounts')}
          >
            <Users className='h-5 w-5 mr-1' /> Accounts
          </Button>
        </div>

        {/* Search & Sort */}
        <div className='flex items-center gap-2 mb-4'>
          <Input
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant='outline'
            size='icon'
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
              <SortAsc className='h-5 w-5' />
            ) : (
              <SortDesc className='h-5 w-5' />
            )}
          </Button>
          <Button variant='outline' size='icon' onClick={addItem}>
            <Plus className='h-5 w-5' />
          </Button>
        </div>
        {/* Dialog for adding new item */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='w-full max-w-md'>
            <DialogHeader>
              <DialogTitle>
                {activeTab === 'Groups' ? 'Create Group' : 'Create Account'}
              </DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <Label htmlFor='newItem'>Name</Label>
              <Input
                id='newItem'
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='secondary'>Cancel</Button>
              </DialogClose>
              <Button onClick={confirmAddItem}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Update */}
        <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
          <DialogContent className='w-full max-w-md'>
            <DialogHeader>
              <DialogTitle>
                Edit {activeTab === 'Groups' ? 'Group' : 'Account'}
              </DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <Label htmlFor='editItem'>Name</Label>
              <Input
                id='editItem'
                value={editItemName}
                onChange={(e) => setEditItemName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='secondary'>Cancel</Button>
              </DialogClose>
              <Button
                onClick={() => {
                  if (!editItemName.trim()) return;
                  if (activeTab === 'Groups') {
                    setGroups(
                      groups.map((g) => (g === editItem ? editItemName : g))
                    );
                  } else {
                    setAccounts(
                      accounts.map((a) => (a === editItem ? editItemName : a))
                    );
                  }
                  setEditItem(null); // 🔥 Đóng dialog sau khi cập nhật
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Delete */}
        <Dialog
          open={!!deleteItemName}
          onOpenChange={() => setDeleteItemName(null)}
        >
          <DialogContent className='w-full max-w-md'>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <p className='text-gray-600'>
              Do you really want to delete <strong>{deleteItemName}</strong>?
              This action cannot be undone.
            </p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='secondary'>Cancel</Button>
              </DialogClose>
              <Button variant='destructive' onClick={handleConfirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* List */}
        <ScrollArea className='h-[580px]'>
          {filteredItems.map((item) => (
            <div
              key={item}
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer w-full ${
                selectedItem === item
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => setSelectedItem(item)}
            >
              <span>{item}</span>
              <div className='flex gap-2'>
                {/* Nút Sửa */}
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditItem(item);
                    setEditItemName(item);
                  }}
                >
                  <Edit className='h-4 w-4' />
                </Button>

                {/* Nút Xóa */}
                <Button
                  variant='ghost'
                  size='icon'
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => handleOpenDeleteDialog(item)}
                >
                  <Trash className='h-4 w-4 text-red-500' />
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Permissions List */}
      <div className='w-3/4 ml-6 bg-white shadow-lg rounded-lg p-4'>
        <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
          <Check className='h-5 w-5' />
          Permissions for{' '}
          <span className='text-blue-500'>
            {selectedItem || 'None Selected'}
          </span>
        </h2>
        <div className='grid grid-cols-2 gap-4'>
          {permissions.map((perm) => (
            <div key={perm.name} className='flex items-center gap-2'>
              <Checkbox
                checked={selectedPermissions.includes(perm.name)}
                onCheckedChange={() => togglePermission(perm.name)}
              />
              <span>{perm.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Permissions;
