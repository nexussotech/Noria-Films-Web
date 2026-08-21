const ADMIN_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER ?? '524495469811'

// wa.me requiere formato internacional completo. Si capturan un número local
// de 10 dígitos (uso común en México, sin código de país), se antepone 52.
function toInternational(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 ? `52${digits}` : digits
}

export function openWhatsApp(phone: string, message: string) {
  const url = `https://wa.me/${toInternational(phone)}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener')
}

export function openWhatsAppAdmin(message: string) {
  openWhatsApp(ADMIN_WHATSAPP, message)
}
