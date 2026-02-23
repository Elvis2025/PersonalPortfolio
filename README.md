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

## Retiro de PHP

- El envío por `forms/contact.php` fue removido.
- El endpoint activo ahora es `POST /api/contact` en Node.js.

## URLs útiles

- App web: `http://localhost:5173`
- API health: `http://localhost:4000/health`
- API contacto: `POST http://localhost:4000/api/contact`
