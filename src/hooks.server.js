import { user_log_on } from "$lib/server/auth_bkp";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {

  if (event.url.pathname.startsWith("/api")) {
    const refresh_token = await event.request.headers.get('refresh-token') || 'nada';
    const ruta = event.url.pathname;
    
    const result = await user_log_on(refresh_token, ruta);

    event.locals.usuario = result;
  }
  
  const response = await resolve(event);
  return response;
}
