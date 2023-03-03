import validar from '$lib/server/valida_solicitud';


/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {

    
    if (event.url.pathname.startsWith("/validar_token")) {
        return new Response('validar_token');
    }

    if (event.url.pathname.startsWith("/login")) {
        console.log('code:', event.url.searchParams.get('code')||'nada')
         Response.redirect('http://localhost:5173/validar_token')
         
        return new Response('acceso a login');
    }


    console.log(event.url.pathname)

    // const clave = event.request.headers.get('ucc-rcm');
    // validar(clave)
    // console.log('HEADERS:', ...event.request.headers)
    // console.log('CLAVE EN HEADERS:', clave);


    if (event.url.pathname.startsWith('/monitor')) {
        return new Response('acceso a monitores');
    }

    const response = await resolve(event);
    return response;
}