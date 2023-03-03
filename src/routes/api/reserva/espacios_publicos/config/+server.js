import { sin_permiso } from '$lib/server/constantes';
import { crear, leerCodUni, modificar } from '$lib/server/servicios/espacios_publicos_param';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals}) {
    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    const cod_uni = url.searchParams.get('cod_uni') || 'zz'
    const result = await leerCodUni(cod_uni);
    return json(result);
}


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    const {cod_uni, max_reserva_dia} = await request.json();

    const result = await crear(cod_uni, max_reserva_dia, locals.usuario.id);

    return json(result);
}


/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, locals }) {

    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    const {cod_uni, max_reserva_dia} = await request.json();

    const result = await modificar(cod_uni, max_reserva_dia, locals.usuario.id)

    return json(result)
}