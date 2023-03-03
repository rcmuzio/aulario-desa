import { dbSelect } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {

    const data = await request.json();
    const edificio_id = data.edificio_id || 0;

    let sql = `
        select distinct 
            e.id, 
            e.nombre,
            e.capacidad,
            e.capacidad_autorizada,
            e.cod_uni
        from 
            aulario_espacios_publicos p,
            aulario_espacios e
        where p.sis_anulado = 0
            and e.id = p.espacio_id 
            and e.edificio_id = ? 
            and e.sis_anulado = 0
        order by
            e.nombre
    `

    let result = await dbSelect(sql, [edificio_id]);

    return json({
        error: false,
        datos: result
    })


}