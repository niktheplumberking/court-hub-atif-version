'use client';
import { Trash2 } from 'lucide-react';
import { deleteProduct } from '@/lib/actions/products';

export default function DeleteProductButton({ id }: { id: string }) {
  return (
    <button
      onClick={async () => {
        if (confirm('Delete this product permanently?')) await deleteProduct(id);
      }}
      className="text-white/20 hover:text-fire transition-colors"
      title="Delete"
    >
      <Trash2 size={15} />
    </button>
  );
}
