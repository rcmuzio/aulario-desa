import { dbSelect } from "$lib/server/db"
import { json } from "@sveltejs/kit"

/** @type {import('./$types').RequestHandler} */
export async function GET({params}) {

    let sql = `select * from aulario_v_reserva where id='${params.id||0}'`

    let filas = await dbSelect(sql, [])

    if (filas.length > 0) {
        // return {
        //     body: {
        //         error: false,
        //         datos: { ...filas[0] }
        //     }
        // }
        return json({
            error: false,
            datos: { ...filas[0] }
        })
    } else {
        // return {
        //     body: {
        //         error: true,
        //         mensaje: 'No se pudo recuperar la reserva solicitada.'
        //     }
        // }
        return json({
            error: true,
            mensaje: 'No se pudo recuperar la reserva solicitada.'
        })
    }
}