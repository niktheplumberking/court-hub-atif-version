'use server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export type InquiryInput = {
  name: string;
  phone: string;
  email?: string;
  court_type?: string;
  location?: string;
  message?: string;
};

// Backup record for Construct Your Court leads — WhatsApp is the primary channel (PLAN §3).
export async function submitInquiry(input: InquiryInput): Promise<{ ok: boolean; error?: string }> {
  const name = input.name?.trim();
  const phone = input.phone?.trim();
  if (!name || !phone) return { ok: false, error: 'Name and phone are required.' };

  const { error } = await supabaseAdmin().from('inquiries').insert({
    name: name.slice(0, 200),
    phone: phone.slice(0, 50),
    email: input.email?.trim().slice(0, 200) || null,
    court_type: input.court_type?.trim().slice(0, 100) || null,
    location: input.location?.trim().slice(0, 200) || null,
    message: input.message?.trim().slice(0, 2000) || null,
  });
  if (error) return { ok: false, error: 'Could not save your inquiry. Please try WhatsApp directly.' };
  return { ok: true };
}
