import { dbAction } from '$lib/server/db';
import { json } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {
    const { reserva_ocupada_id } = await request.json()

    let sis_usuario_id = locals.usuario.id || false;

    if (sis_usuario_id === false) {
        return json({ accion: 'DELETE', error: true, mensaje: "Usted no está autenticado." });
    }

    let sql = `
        update aulario_reserva_ocupada set 
        sis_anulado = 1,
        sis_fecha = now(),
        sis_usuario_id = ?
        where id = ?
    `

    const result = await dbAction(sql, [sis_usuario_id, reserva_ocupada_id])

    return json({
        error: false,
        mensaje: 'La reserva se borró correctamente',
        result
    });

}