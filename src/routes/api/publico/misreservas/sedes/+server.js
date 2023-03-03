import { dbSelect } from '$lib/server/db'
import { json } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function GET(event) {

    let sql = `
        select distinct 
            s.id, 
            s.nombre
        from 
            aulario_espacios_publicos p,
            aulario_espacios e,
            aulario_edificios f,
            aulario_sedes s
        where p.sis_anulado = 0
            and e.id = p.espacio_id and e.sis_anulado = 0
            and f.id = e.edificio_id and f.sis_anulado = 0
            and s.id = f.sede_id and s.sis_anulado = 0
        order by
            s.nombre
    `

    let filas = await dbSelect(sql, [])

    return json({
        error: false,
        datos: filas
    })

}