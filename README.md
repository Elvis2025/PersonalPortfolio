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
2. Completa credenciales SMTP reales (Gmail u otro proveedor).

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



## Proveedor de correo (SMTP / Nodemailer)

## `.env` listo para Gmail (copiar/pegar)

```bash
PORT=4000
CONTACT_TO_EMAIL=inelvis16031124@gmail.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_app_password_de_16_caracteres
EMAIL_FROM="Portfolio <tu_correo@gmail.com>"
EMAIL_SECURE=false
FRONTEND_URL=http://localhost:5173
```

El backend usa Nodemailer con SMTP para enviar emails del formulario.

Variables requeridas:

- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `CONTACT_TO_EMAIL`

Variables opcionales:

- `EMAIL_FROM` (default: `Portfolio <EMAIL_USER>`)
- `EMAIL_SECURE` (`true`/`false`, por defecto `true` si el puerto es `465`)

Ejemplo:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_app_password
EMAIL_FROM="Portfolio <tu_correo@gmail.com>"
EMAIL_SECURE=false
CONTACT_TO_EMAIL=tu_correo@dominio.com
```

## Troubleshooting de envío de correo (SMTP)',

Si el formulario devuelve `503` o falla el envío:

1. Verifica que `.env` exista en la raíz del proyecto y que cada variable esté en una línea real (no uses `\n` literal dentro del archivo).
2. Verifica `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` y `CONTACT_TO_EMAIL` en `.env`.
3. En Gmail, usa 2FA + App Password (no contraseña normal).
4. Revisa la respuesta JSON de `POST /api/contact` y el campo `reason` para diagnosticar (`EAUTH`, `535`, `ESOCKET`, etc.).

## Retiro de PHP

- El envío por `forms/contact.php` fue removido.
- El endpoint activo ahora es `POST /api/contact` en Node.js.

## URLs útiles

- App web: `http://localhost:5173`
- API health: `http://localhost:4000/health`
- API contacto: `POST http://localhost:4000/api/contact`
