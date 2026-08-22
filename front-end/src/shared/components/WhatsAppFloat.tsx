const whatsappPhone = '18498698664';
const whatsappMessage = 'Hola, vi tu portafolio y quiero hablar contigo.';
const whatsappHref = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`;

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float fab fab--whatsapp"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
    >
      {/* Cambia el número y mensaje en whatsappPhone / whatsappMessage */}
      <span className="fab__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="img" focusable="false">
          <path
            fill="currentColor"
            d="M16.75 13.96c-.25-.13-1.47-.72-1.7-.8-.23-.08-.4-.12-.57.13-.17.25-.65.8-.79.96-.15.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.25-.74-.66-1.24-1.48-1.39-1.73-.14-.24-.02-.37.11-.49.11-.11.25-.29.37-.43.12-.14.16-.24.25-.41.08-.16.04-.31-.02-.43-.06-.13-.57-1.36-.78-1.86-.2-.48-.41-.42-.57-.42h-.49c-.17 0-.43.06-.65.32-.23.25-.85.83-.85 2.1 0 1.26.91 2.47 1.04 2.64.13.17 1.78 2.72 4.3 3.82.6.26 1.06.42 1.42.53.6.19 1.14.17 1.57.1.48-.07 1.47-.6 1.68-1.2.2-.6.2-1.11.14-1.21-.07-.1-.24-.15-.49-.28Z"
          />
          <path
            fill="currentColor"
            d="M20.52 3.48A11.8 11.8 0 0 0 12.1 0C5.57 0 .25 5.31.25 11.84c0 2.09.55 4.13 1.6 5.92L0 24l6.4-1.82a11.77 11.77 0 0 0 5.65 1.44h.01c6.52 0 11.84-5.31 11.84-11.84 0-3.16-1.23-6.14-3.47-8.3Zm-8.46 18.14h-.01a9.77 9.77 0 0 1-4.98-1.37l-.36-.21-3.8 1.08 1.02-3.7-.23-.38A9.78 9.78 0 0 1 2.2 11.84c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 7c0 5.45-4.45 9.88-9.9 9.88Z"
          />
        </svg>
      </span>
    </a>
  );
}
