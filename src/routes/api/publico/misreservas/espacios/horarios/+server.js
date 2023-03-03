import { dbSelect } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {

    const data = await request.json();
    const fecha = data.fecha || '0000-00-00';
    const espacio_id = data.espacio_id || 0;

    let sql = `
        select  
            id,
            desde,
            horario,
            estado,
            f1, f2, f3,
            espacio,
            username,
            max_reserva_dia
        from 
            aulario_v_reserva_ocupada
        where espacio_id = ? 
            and fecha = ?
        order by
            desde
    `

    console.log('SQL:::', sql)
    console.log('espacio_id:::', espacio_id)
    console.log('fecha:::', fecha)

    let result = await dbSelect(sql, [espacio_id, fecha]);

    return json({
        error: false,
        datos: result
    })

}