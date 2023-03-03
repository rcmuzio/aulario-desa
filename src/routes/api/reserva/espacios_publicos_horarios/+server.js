import { sin_permiso } from '$lib/server/constantes';
import { dbAction } from '$lib/server/db';
import { borrar } from '$lib/server/servicios/espacios_publicos_horarios';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {

    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    const {cod_uni, anio_academico} = await request.json();

    const result = await borrar(cod_uni, anio_academico, locals.usuario.id)

    return json(result)
}