import { supabaseServer } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';
import type { Category } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function NewProduct() {
  const supabase = await supabaseServer();
  const { data: categories } = await supabase.from('categories').select('*').order('sort');
  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl text-white">Add Product</h1>
      <ProductForm categories={(categories ?? []) as Category[]} />
    </div>
  );
}
