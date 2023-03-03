import { json } from '@sveltejs/kit';
import { solicitar_nuevo_token } from '$lib/server/auth';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const datos = await request.json()


    if (!datos.refresh_token) {
        return json({ error: true, mensaje: 'Solicitud no válida.' })
    }

    const nuevo_token = await solicitar_nuevo_token(datos.refresh_token);

    return json(nuevo_token)
}