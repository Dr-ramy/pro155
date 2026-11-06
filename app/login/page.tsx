'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaHome, FaSignInAlt } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function LoginPage() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user.trim() || !password.trim()) {
      const msg = 'يرجى إدخال اسم المستخدم وكلمة المرور.';
      setError(msg);
      toast.error(msg);
      return;
    }

    const res = await signIn('credentials', {
      redirect: false,
      user,
      password,
    });

    if (res?.error) {
      setError(res.error);
      toast.error(res.error);
      return;
    }

    const session = await fetch('/api/auth/session').then(r => r.json());
    const groupid = session.user?.groupid;
    if (groupid === 10) router.push('/admin');
    else if (groupid <= 9) router.push('/content');
    else {
      const msg = 'غير مصرح لك بالدخول.';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">تسجيل الدخول</CardTitle>
        </CardHeader>

        <CardContent>
          {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="user">اسم المستخدم</Label>
              <Input
                id="user"
                value={user}
                onChange={e => setUser(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <Button type="submit" className="w-full flex items-center justify-center gap-2">
              <FaSignInAlt className="w-5 h-5" />
              تسجيل الدخول
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Link href="/">
                <FaHome className="w-5 h-5" />
                العودة للرئيسية
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
