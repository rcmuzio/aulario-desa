import { agregar, borrar } from '$lib/server/servicios/espacios_fotos';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    const { espacio_id, type, base64 } = await request.json()

    const result = await agregar(espacio_id, type, base64, locals.usuario.id);

    return json(result)
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {
    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    const { id } = await request.json()

    const result = await borrar(id, locals.usuario.id);

    return json(result)
}