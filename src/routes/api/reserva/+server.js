// import { actualizar, consultar } from "../../../lib/db/database"
import { get_usuario_username } from "$lib/server/funciones"
import { dbAction, dbSelect } from "$lib/server/db"
import { json } from "@sveltejs/kit"



/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {

    const data = await request.json()

    // return {
    //     body: { accion: "AGREGAR" }
    // }
    return json({ accion: "AGREGAR" })
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, locals }) {

    const data = await request.json()
    const sis_usuario_id = locals.usuario.id || 99999

    let sql = `
        select *
        from aulario_v_reserva
        where id != '${data.id}'
        and (espacio_id = '${data.espacio_id}' or (cod_prof='${data.cod_prof}' and cod_prof>''))
        and fecha = '${data.fecha}'
        and confirmada = 1
        and (
            ( desde <= '${data.desde}' and hasta >= '${data.desde}' ) or
            ( desde <= '${data.hasta}' and hasta >= '${data.hasta}' ) or
            ( desde >= '${data.desde}' and hasta <= '${data.hasta}' )
        )
    `

    let filas = await dbSelect(sql, []);

    if (filas.length > 0) {
        // return {
        //     body: {
        //         error: true,
        //         mensaje: 'No se puede modificar, se superpone con otra actividad o con otro horario del docente.'
        //     }
        // }
        return json({
            error: true,
            mensaje: 'No se puede modificar, se superpone con otra actividad o con otro horario del docente.'
        })
    } else {
        sql = `
            update aulario_reserva set
            espacio_id = '${data.espacio_id}',
            cod_uni = '${data.cod_uni}',
            cod_car = '${data.cod_car}',
            cod_mate = '${data.cod_mate}',
            cod_prof = '${data.cod_prof}',
            curso = '${data.curso}',
            catedra = '${data.catedra}',
            comision = '${data.comision}',
            tipo_acti = '${data.tipo_acti}',
            descri = '${data.descri}',
            fecha = '${data.fecha}',
            desde = '${data.desde}',
            hasta = '${data.hasta}',
            sis_fecha = now(),
            sis_usuario_id = '${sis_usuario_id}'
            where id = '${data.id}'
        `

        let update = await dbAction(sql, []);

        return json({
            error: false,
            update
        })
    }
}


/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {

    const data = await request.json()
    console.log('LOCALS USUARIO:',locals)
    const sis_usuario_id = locals.usuario.id || 99999;

    let sql = `
            update aulario_reserva set
            sis_anulado = '1',
            sis_fecha = now(),
            sis_usuario_id = '${sis_usuario_id}'
            where id = '${data.id}'
        `

    let novedad = await dbAction(sql, []);

    return json({
        error: false,
        novedad
    })

}