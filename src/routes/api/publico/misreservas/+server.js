import { sin_permiso } from "$lib/server/constantes";
import { dbAction, dbSelect } from "$lib/server/db";
import { json } from "@sveltejs/kit";


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {

    console.log('AGREGAR RESERVA......')
    if (!locals.usuario || !locals.usuario.autorizado) {
        console.log('NO TIENE PERMISO...')
        return json(sin_permiso)
    }
    
    const { reserva_id } = await request.json()

    let sql = `
        insert into aulario_reserva_ocupada
            (reserva_id, usuario_id, sis_usuario_id, sis_fecha)

        select ?, ?, ?, now()
        from dual
        where (
            select count(x.id)
            from aulario_reserva_ocupada x
            where x.id = ?
            and x.sis_anulado = 0
        ) = 0
    `

    const param = [
        reserva_id,
        locals.usuario.id,
        locals.usuario.id,
        reserva_id
    ]
    
    let result = await dbAction(sql, param)

    return json({
        error: false,
        mensaje: 'Reserva confirmada',
        nuevo_id: result
    })

}


/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {
    const { reserva_ocupada_id } = await request.json();

    const sis_usuario_id = locals.usuario.id || 99999;

    let sql = `
        select a.*, concat(date_format(b.fecha, '%Y-%m-%d'), ' ', b.desde ) as fecha, date_format(now(), '%Y-%m-%d %H:%i:%s') as fecha_actual
        from 
            aulario_reserva_ocupada a,
            aulario_reserva b
        where a.id = ?
            and a.sis_anulado=0
            and b.id = a.reserva_id
    `

    let result = await dbSelect(sql, [reserva_ocupada_id])


    if (result.length > 0) {
        let fila = result[0]
        if (fila.fecha < fila.fecha_actual) {
            return json({
                error: true,
                mensaje: 'No puede cancelar reservas anteriores al día de hoy.',
            });
        }
    }

    sql = `
        update aulario_reserva_ocupada set 
        sis_anulado = 1,
        sis_fecha_anulado = now(),
        sis_usuario_id = ?
        where id = ?
    `

    result = await dbAction(sql, [sis_usuario_id, reserva_ocupada_id]);

    return json({
        error: false,
        mensaje: 'Reserva Anulada',
        borrada: result
    })
}

