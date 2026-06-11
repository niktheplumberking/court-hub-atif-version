'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-ink-2 rounded-[20px] p-8 space-y-5 border border-white/5">
        <h1 className="font-display font-bold tracking-[0.25em] text-white text-center">
          COURT <span className="text-lime">HUB</span>
        </h1>
        <p className="text-white/40 text-xs text-center uppercase tracking-widest">Admin Panel</p>
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-ink border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-lime outline-none" />
        <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-ink border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-lime outline-none" />
        {error && <p className="text-fire text-sm">{error}</p>}
        <button disabled={loading} className="w-full py-3 rounded-full bg-lime text-ink font-bold disabled:opacity-50">
          {loading ? 'Signing in…' : 'SIGN IN'}
        </button>
      </form>
    </main>
  );
}
