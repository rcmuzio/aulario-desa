import { dbSelect } from "$lib/server/db"
import { json } from "@sveltejs/kit"


/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {

    let sql = `
        select *
        from aulario_v_reserva_publico
        where id = ?
    `

    let filas = await dbSelect(sql, [params.id])

    console.log('FILAS:', filas[0])

    return json({
        error: false,
        filas,
    });
}