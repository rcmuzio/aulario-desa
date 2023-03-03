import { dbSelect } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {

    const {fecha, desde, hasta} = await request.json()

    const sql = `
        select id, sede, edificio, unidad, tipo_espacio, espacio, planta, capacidad, capacidad_autorizada, climatizado, ventilado
        from aulario_v_espacios
        where disponible=1
        and id not in(
            select distinct espacio_id
            from aulario_reserva
            where fecha = '${fecha.substring(0,10)}'
            and sis_anulado = 0
            and confirmada = 1
            and (
                (desde <= '${desde}' and hasta >= '${desde}') or
                (desde <= '${hasta}' and hasta >= '${hasta}') or
                (desde >= '${desde}' and hasta <= '${hasta}')
            )
        )
        order by sede, edificio, planta, espacio
    `
    
    let filas = await dbSelect(sql,[]);
    
    return json(filas)
 
}