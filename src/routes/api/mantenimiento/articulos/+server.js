import { dbSelect } from '$lib/server/db';
import { json, error } from '@sveltejs/kit';
import { leer, agregar, modificar, borrar } from '$lib/server/servicios/articulos';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {

    if (!locals.usuario || !locals.usuario.autorizado) {
        return json({ error: true, mensaje: 'No tiene permiso para acceder a esta página' });
    }

    const id = url.searchParams.get('id') || 0;

    const result = await leer(id);

    return json(result);
}


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    if (!locals.usuario || !locals.usuario.autorizado) {
        return json({ error: true, mensaje: 'No tiene permiso para acceder a esta página' });
    }

    const sis_usuario_id = locals.usuario.id || 9999;

    const datos = await request.json()

    const result = await agregar(datos, sis_usuario_id);

    return json(result)
}


/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, locals }) {

    if (!locals.usuario || !locals.usuario.autorizado) {
        return json({ error: true, mensaje: 'No tiene permiso para acceder a esta página' });
    }

    const sis_usuario_id = locals.usuario.id || 9999;

    const datos = await request.json()

    const result = await modificar(datos, sis_usuario_id);

    return json(result)
}


/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {
    if (!locals.usuario || !locals.usuario.autorizado) {
        return json({ error: true, mensaje: 'No tiene permiso para acceder a esta página' });
    }

    const sis_usuario_id = locals.usuario.id || 9999;

    const datos = await request.json()

    const result = await borrar(datos, sis_usuario_id);

    return json(result)
}