import { dbSelect } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {

    let condi = '';

    let filtros = {
        "reservables" : ` and reserva = 1 `
    }

    const data = await request.json()

    if(data.filtros){
        data.filtros.map((f)=>{
            condi += filtros[f]
        })
    }

    let sql = `
        select id, nombre
        from aulario_espacios
        where cod_uni = ?
            and sis_vigente = 1
            and sis_anulado = 0
            ${condi}
            order by nombre
    `
    
    let espacios = await dbSelect(sql, [data.cod_uni]);
    
    return json({ espacios })
}