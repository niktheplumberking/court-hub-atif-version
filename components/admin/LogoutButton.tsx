'use client';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await supabaseBrowser().auth.signOut();
        router.push('/admin/login');
        router.refresh();
      }}
      className="text-white/40 hover:text-white text-sm"
    >
      Sign out
    </button>
  );
}
