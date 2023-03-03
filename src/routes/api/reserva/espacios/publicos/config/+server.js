import { sin_permiso } from '$lib/server/constantes';
import { dbAction, dbSelect } from '$lib/server/db';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, locals }) {

    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    let sql = `
        update aulario_reserva_param set
        max_reserva_dia = ?,
        sis_fecha = now(),
        sis_usuario_id = ?
        where cod_uni = ?
        and sis_anulado = 0
    `;

    let param = [max_reserva_dia, locals.usuario.id, cod_uni];

    const result = await dbAction(sql, param)

    return json(result)
}


