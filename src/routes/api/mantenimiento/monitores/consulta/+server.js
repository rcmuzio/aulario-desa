import { sin_permiso } from '$lib/server/constantes';
import { consulta } from '$lib/server/servicios/monitores';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    const { paginado, items } = await request.json();

    return json(await consulta(paginado, items));
}
