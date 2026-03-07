'use client';

import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="mt-8 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Email</h2>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">User ID</h2>
          <p className="text-muted-foreground">{user.uid}</p>
        </div>
        <Button onClick={handleLogout}>Log Out</Button>
      </div>
    </div>
  );
}
