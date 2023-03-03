import { dbSelect } from "$lib/server/db";
import { json } from "@sveltejs/kit";


/** @type {import('./$types').RequestHandler} */
export async function POST({request}){

    const data = await request.json();

    let sql = `
        select *
        from aulario_monitores
        where cod_uni = '${data.cod_uni}'
        and sis_anulado = 0
        order by planta, monitor
    `

    const filas = await dbSelect(sql, []);

    console.log('BACKEND aulario_monitores DE :', data.cod_uni, filas)

    return json(filas)

}