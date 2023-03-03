import { sin_permiso } from '$lib/server/constantes';
import { agregar, borrar, modificar } from '$lib/server/servicios/monitores';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    const datos = await request.json();

    return json(await agregar(datos, locals.usuario.id));
}


/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, locals }) {
    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    const datos = await request.json();

    return json(await modificar(datos, locals.usuario.id));
}


/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {
    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    const datos = await request.json();

    return json(await borrar(datos.id, locals.usuario.id));
}
