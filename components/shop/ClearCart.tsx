'use client';
import { useEffect } from 'react';
import { useCart } from '@/lib/cart-context';

/** Empties the local cart once the user lands on the success page. */
export default function ClearCart() {
  const { clear } = useCart();
  useEffect(() => { clear(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  return null;
}
