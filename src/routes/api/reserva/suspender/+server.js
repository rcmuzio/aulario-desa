// import { get_usuario_username } from "$lib/db/funciones"
import { get_usuario_username } from "$lib/server/funciones";
import { dbAction } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, locals }) {

    const data = await request.json()

    const sis_usuario_id = locals.usuario.id||99999;

    let sql = `
        update aulario_reserva set
            suspendida = 1,
            suspendida_motivo = '${data.motivo}',
            sis_fecha = now(),
            sis_usuario_id = '${sis_usuario_id}'
        where id = '${data.reserva_id}'
    `

    let update = await dbAction(sql, []);

    return json({
        error: false,
        update
    })

}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {

    const data = await request.json()
    const sis_usuario_id = locals.usuario.id||99999;

    if (!locals.usuario) {
        return json({
            error: true,
            mensaje: "Usuario no identificado."
        })
    }

    let sql = `
        update aulario_reserva set
            suspendida = 0,
            suspendida_motivo = 'SE CANCELÓ LA SUSPENCIÓN',
            sis_fecha = now(),
            sis_usuario_id = ?
        where id = ?
    `

    let update = await dbAction(sql,[sis_usuario_id, data.reserva_id]);

    return json({
        error: false,
        update
    })

}
