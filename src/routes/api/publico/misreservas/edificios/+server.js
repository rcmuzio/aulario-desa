import { dbSelect } from "$lib/server/db";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {

    const data = await request.json();
    const sede_id = data.sede_id || 0;

    let sql = `
        select distinct 
            f.id, 
            f.nombre
        from 
            aulario_espacios_publicos p,
            aulario_espacios e,
            aulario_edificios f
        where p.sis_anulado = 0
            and e.id = p.espacio_id and e.sis_anulado = 0
            and f.id = e.edificio_id and f.sis_anulado = 0
            and f.sede_id = ?
        order by
            f.nombre
    `

    let result = await dbSelect(sql, [sede_id]);

    return json({ error: false, datos: result})

}