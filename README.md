# Personal Portfolio (React + Node + TypeScript)

Este proyecto migró de HTML/CSS/JS + PHP a un monorepo con:

- `client/`: React + TypeScript + SCSS
- `server/`: Node.js + Express + TypeScript + Nodemailer

## Requisitos

- Node.js 20+

## Instalación

```bash
npm install
npm install --prefix client
npm install --prefix server
```

## Variables de entorno

1. Copia `.env.example` a `.env`.
2. Completa credenciales SMTP reales.

```bash
cp .env.example .env
```

## Ejecutar en desarrollo

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`
- Si abres `http://localhost:4000` en el navegador, ahora redirige automáticamente al frontend.

## Probar formulario de contacto

1. Levanta client y server con `npm run dev`.
2. Abre la web, completa Nombre/Email/Asunto/Mensaje.
3. Envía y valida estado loading/success/error.
4. Verifica llegada del correo a `inelvis16031124@gmail.com`.



## Proveedor de correo (SMTP o Resend)

El backend soporta dos modos:

1. `MAIL_PROVIDER=smtp` (default): usa `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
2. `MAIL_PROVIDER=resend`: usa API HTTP de Resend con `RESEND_API_KEY` y `RESEND_FROM` (además de `CONTACT_TO_EMAIL`).

Ejemplo Resend:

```bash
MAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM="Portfolio <onboarding@resend.dev>"
CONTACT_TO_EMAIL=tu_correo@dominio.com
```

> No necesitas instalar librerías adicionales para usar Resend en este proyecto: se usa `fetch` nativo de Node.js.

## Troubleshooting de envío de correo (Gmail)

Si el formulario devuelve `503` o falla el envío:

1. Verifica que `.env` exista en la raíz del proyecto y que cada variable esté en una línea real (no uses `\n` literal dentro del archivo).
2. Asegúrate de tener 2FA activa en Gmail y usa una **App Password** como `SMTP_PASS` (no la contraseña normal de Gmail).
3. Si copiaste la App Password con espacios o comillas, el servidor ahora los normaliza automáticamente; aun así, valida que no haya caracteres extra.
4. Revisa la respuesta JSON de `POST /api/contact` y el campo `reason` para diagnosticar (`EAUTH`, `535`, `ESOCKET`, etc.).

## Retiro de PHP

- El envío por `forms/contact.php` fue removido.
- El endpoint activo ahora es `POST /api/contact` en Node.js.

## URLs útiles

- App web: `http://localhost:5173`
- API health: `http://localhost:4000/health`
- API contacto: `POST http://localhost:4000/api/contact`
