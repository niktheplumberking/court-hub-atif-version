'use client';
import { useTransition } from 'react';
import { updateOrderStatus } from '@/lib/actions/products';

export default function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => start(() => updateOrderStatus(id, e.target.value))}
      className="bg-ink border border-white/10 rounded-full px-4 py-2 text-white text-sm outline-none focus:border-lime"
    >
      <option value="paid">Paid</option>
      <option value="fulfilled">Fulfilled</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
