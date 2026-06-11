import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';
import type { Category, Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await supabaseServer();
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('sort'),
  ]);
  if (!product) notFound();
  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl text-white">Edit Product</h1>
      <ProductForm product={product as Product} categories={(categories ?? []) as Category[]} />
    </div>
  );
}
