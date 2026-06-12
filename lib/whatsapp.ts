// Single source of truth for the WhatsApp conversion path (primary lead channel, all pages).
// The fallback is a placeholder — the real business number arrives with client copy and lands
// in NEXT_PUBLIC_WHATSAPP_NUMBER (no + or spaces). Never hardcode wa.me numbers elsewhere.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971000000000';

export function waHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
