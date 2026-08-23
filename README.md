# Personal Portfolio (React + Node + TypeScript)

Este proyecto migró de HTML/CSS/JS + PHP a un monorepo con:

- `front-end/`: React + TypeScript + SCSS
- `back-end/`: Node.js + Express + TypeScript + Resend

## Arquitectura

El frontend está organizado por funcionalidades y responsabilidades:

- `front-end/src/app`: composición y ciclo de vida global.
- `front-end/src/domain`: modelos y contratos.
- `front-end/src/content`: traducciones y catálogos.
- `front-end/src/features`: vistas aisladas por funcionalidad.
- `front-end/src/shared`: componentes, layout y navegación reutilizables.

El backend sigue una arquitectura limpia:

- `back-end/src/domain`: reglas y validaciones del negocio.
- `back-end/src/application`: casos de uso y puertos.
- `back-end/src/infrastructure`: adaptadores de Resend y archivos.
- `back-end/src/presentation`: rutas HTTP.
- `back-end/src/config`: configuración del entorno.
- `back-end/src/app.ts`: composición de Express.

## Requisitos

- Node.js 20+

## Instalación

```bash
npm install
npm install --prefix front-end
npm install --prefix back-end
```

## Variables de entorno

1. Copia `.env.example` a `.env`.
2. Completa las credenciales de Resend y el correo destinatario.

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

1. Levanta front-end y back-end con `npm run dev`.
2. Abre la web, completa Nombre/Email/Asunto/Mensaje.
3. Envía y valida estado loading/success/error.
4. Verifica llegada del correo a `inelvis16031124@gmail.com`.

Después de una entrega correcta, el visitante recibe una respuesta automática en el idioma activo del portafolio. El correo incluye una presentación de agradecimiento, la foto de perfil incrustada y el CV correspondiente como archivo PDF adjunto.

## Descarga y notificación del CV

- La aplicación descarga el PDF en inglés o español según el idioma activo.
- Después de una descarga completada, Resend envía una notificación a `CONTACT_TO_EMAIL`.
- La notificación incluye navegador, país y provincia/región aproximados.
- La ubicación se obtiene a partir de la IP pública mediante `ipapi.co`; en desarrollo local o si el servicio no responde se informa como desconocida.
- La descarga nunca se bloquea por un fallo de geolocalización o de notificación.

Como esta función procesa información técnica y ubicación aproximada del visitante, debe explicarse en la política de privacidad del sitio antes de utilizarla en producción.



## Proveedor de correo (Resend)

## `.env` de ejemplo

```bash
PORT=4000
CONTACT_TO_EMAIL=inelvis16031124@gmail.com
RESEND_API_KEY=re_tu_api_key
RESEND_FROM="Portfolio <contacto@tu-dominio-verificado.com>"
ALLOWED_ORIGINS=http://localhost:5173
```

El adaptador de infraestructura usa Resend para entregar los mensajes del formulario.

Variables requeridas:

- `RESEND_API_KEY`
- `RESEND_FROM`
- `CONTACT_TO_EMAIL`

Variables opcionales:

- `ALLOWED_ORIGINS`: orígenes permitidos separados por comas.
- `CV_STORAGE_PATH`: ubicación externa de los currículums.

## Troubleshooting de envío de correo

Si el formulario devuelve `503` o falla el envío:

1. Verifica que `.env` exista en la raíz del proyecto y que cada variable esté en una línea real (no uses `\n` literal dentro del archivo).
2. Verifica `RESEND_API_KEY`, `RESEND_FROM` y `CONTACT_TO_EMAIL`.
3. Confirma que el dominio de `RESEND_FROM` esté verificado en Resend.
4. Revisa la respuesta JSON de `POST /api/contact` y los logs del servidor.

## Retiro de PHP

- El envío por `forms/contact.php` fue removido.
- El endpoint activo ahora es `POST /api/contact` en Node.js.

## URLs útiles

- App web: `http://localhost:5173`
- API health: `http://localhost:4000/health`
- API contacto: `POST http://localhost:4000/api/contact`
