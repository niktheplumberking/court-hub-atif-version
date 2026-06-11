import { supabaseServer } from '@/lib/supabase/server';
import { formatAED } from '@/lib/utils';
import type { Order } from '@/lib/types';
import OrderStatusSelect from '@/components/admin/OrderStatusSelect';

export const dynamic = 'force-dynamic';

export default async function AdminOrders() {
  const supabase = await supabaseServer();
  const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl text-white">Orders <span className="text-white/30 text-base font-sans font-normal">({orders?.length ?? 0})</span></h1>
      <div className="space-y-3">
        {(orders as Order[] | null)?.map((o) => (
          <div key={o.id} className="bg-ink-2 rounded-[20px] border border-white/5 p-5 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium">{o.customer_name ?? 'Customer'} <span className="text-white/30 text-sm">· {o.customer_email}</span></p>
              <p className="text-white/50 text-sm mt-1">
                {o.items.map((i) => `${i.title} ×${i.qty}`).join(' · ')}
              </p>
              <p className="text-white/30 text-xs mt-1">{new Date(o.created_at).toLocaleString('en-AE')} {o.customer_phone ? `· ${o.customer_phone}` : ''}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lime font-display font-bold">{formatAED(o.amount_aed)}</span>
              <OrderStatusSelect id={o.id} status={o.status} />
            </div>
          </div>
        ))}
        {(!orders || orders.length === 0) && (
          <p className="text-white/30 py-16 text-center bg-ink-2 rounded-[20px] border border-white/5">No orders yet — they&apos;ll appear here the moment Stripe confirms a payment.</p>
        )}
      </div>
    </div>
  );
}
