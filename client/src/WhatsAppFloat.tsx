const whatsappPhone = '18498698664';
const whatsappMessage = 'Hola, vi tu portafolio y quiero hablar contigo.';
const whatsappHref = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`;

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
    >
      {/* Cambia el número y mensaje en whatsappPhone / whatsappMessage */}
      <span className="whatsapp-float__icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" role="img" focusable="false">
          <path fill="currentColor" d="M19.11 17.3c-.27-.14-1.58-.78-1.82-.87-.24-.09-.42-.14-.59.14-.17.27-.67.87-.82 1.05-.15.18-.31.2-.58.07-.27-.14-1.13-.42-2.15-1.35-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.54.12-.12.27-.31.41-.46.14-.15.18-.27.27-.46.09-.18.05-.35-.02-.5-.07-.14-.59-1.43-.81-1.95-.21-.51-.43-.44-.59-.45h-.5c-.18 0-.46.07-.7.35-.24.27-.91.89-.91 2.17s.93 2.51 1.06 2.69c.14.18 1.84 2.81 4.45 3.95.62.27 1.1.43 1.48.55.62.2 1.18.17 1.62.1.5-.08 1.58-.65 1.8-1.27.22-.62.22-1.15.15-1.26-.07-.1-.25-.16-.52-.3Z" />
          <path fill="currentColor" d="M16.02 5.33c-5.85 0-10.61 4.76-10.61 10.61 0 1.87.49 3.69 1.41 5.3L5.2 26.67l5.57-1.58a10.54 10.54 0 0 0 5.24 1.43h.01c5.84 0 10.6-4.76 10.6-10.61 0-2.83-1.1-5.48-3.1-7.49a10.53 10.53 0 0 0-7.5-3.09Zm0 19.39h-.01a8.76 8.76 0 0 1-4.46-1.22l-.32-.19-3.31.94.89-3.22-.21-.33a8.8 8.8 0 0 1 1.35-11.06 8.72 8.72 0 0 1 6.07-2.5c2.3 0 4.46.9 6.09 2.52a8.57 8.57 0 0 1 2.52 6.08c0 4.8-3.9 8.7-8.7 8.7Z" />
        </svg>
      </span>
    </a>
  );
}
