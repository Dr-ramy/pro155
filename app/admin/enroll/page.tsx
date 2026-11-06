'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

import { FaEdit, FaTrash, FaPlus, FaFileExport, FaSearch, FaUserShield } from 'react-icons/fa';

type RecordItem = {
  _id?: string;
  name: string;
  user: string;
  email: string;
  password: string;
  groupid: number;
};

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [filtered, setFiltered] = useState<RecordItem[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true); // <-- الحالة الجديدة
  const [current, setCurrent] = useState<RecordItem>({
    name: '', user: '', email: '', password: '', groupid: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get<RecordItem[]>('/api/records');
      setRecords(res.data);
      setFiltered(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!current.name || !current.user || !current.email || !current.password || !current.groupid) {
      setError('جميع الحقول مطلوبة');
      return;
    }

    try {
      if (current._id) {
        await axios.put(`/api/records/${current._id}`, current);
      } else {
        await axios.post('/api/records', current);
      }
      setDialogOpen(false);
      setError('');
      fetchRecords();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error || 'فشل في الحفظ');
      } else {
        setError('حدث خطأ غير متوقع');
      }
    }
  };

  const remove = async (id?: string) => {
    if (!id) return;
    if (confirm('هل أنت متأكد من الحذف؟')) {
      await axios.delete(`/api/records/${id}`);
      fetchRecords();
    }
  };

  const searchRecords = () => {
    const q = search.toLowerCase().trim();
    setFiltered(records.filter(r =>
      r.name.toLowerCase().includes(q) || r.user.toLowerCase().includes(q)
    ));
  };

  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Users');
    sheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'User', key: 'user', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Password', key: 'password', width: 20 },
      { header: 'Group ID', key: 'groupid', width: 10 },
    ];
    sheet.addRows(records);
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_data.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 flex items-center gap-2 cursor-pointer">
              <FaPlus /> إضافة / تعديل
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{current._id ? 'تعديل' : 'إضافة'} مستخدم</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {(['name','user','email','password','groupid'] as const).map(field => (
                <div key={field}>
                  <Label htmlFor={field}>{field}</Label>
                  <Input
                    id={field}
                    type={field === 'groupid' ? 'number' : 'text'}
                    value={String(current[field as keyof RecordItem] ?? '')}
                    onChange={e =>
                      setCurrent(prev => ({
                        ...prev,
                        [field]: field === 'groupid'
                          ? Number(e.target.value)
                          : e.target.value
                      }))
                    }
                  />
                </div>
              ))}
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">إلغاء</Button>
              </DialogClose>
              <Button onClick={save}>حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* زر صفحة المشرف */}
        <Link href="/admin" className="ml-auto">
          <Button className="bg-gray-600 text-white hover:bg-gray-700 flex items-center gap-2 cursor-pointer">
            <FaUserShield /> صفحة المشرف
          </Button>
        </Link>
      </div>

      {/* البحث والتصدير */}
      <div className="flex flex-wrap items-center gap-2">
        <Label htmlFor="search" className="whitespace-nowrap">بحث:</Label>
        <Input
          id="search"
          className="flex-1"
          placeholder="الاسم أو المستخدم"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchRecords()}
        />
        <Button onClick={searchRecords} className="bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center gap-2">
          <FaSearch /> بحث
        </Button>
        <Button onClick={exportExcel} className="bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2">
          <FaFileExport /> تصدير
        </Button>
      </div>

      {/* جدول البيانات أو Skeleton أثناء التحميل */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                {['الاسم','المستخدم','البريد','كلمة المرور','Group ID','إجراءات'].map(h => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r._id}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.user}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>{r.password}</TableCell>
                  <TableCell>{r.groupid}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-yellow-500 text-white hover:bg-yellow-600 px-2 py-1 flex items-center gap-1"
                      onClick={() => {
                        setCurrent(r);
                        setDialogOpen(true);
                      }}
                    >
                      <FaEdit /> تعديل
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 text-white hover:bg-red-700 px-2 py-1 flex items-center gap-1"
                      onClick={() => remove(r._id)}
                    >
                      <FaTrash /> حذف
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
