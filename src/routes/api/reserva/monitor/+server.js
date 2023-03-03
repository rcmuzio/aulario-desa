import { dbSelect } from "$lib/server/db";
import { json } from "@sveltejs/kit";


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {

    const data = await request.json()


    let sql = `
    select x.id, x.desde, x.hasta, x.sede, x.edificio, x.espacio, x.planta, x.unidad, 
    x.unidad_academica, x.carrera, x.materia, x.docente, x.catedra, x.comision, x.descri, x.suspendida,
    ifnull(upper(concat(x.carrera,' / ',x.materia, ' (', x.catedra,') (', x.comision, ') / ', x.docente, ' / ',x. descri)), descri) as actividad,
    date_format(now(), '%H:%i') as ahora
    from (
        select r.id,
        r.fecha,
            date_format(r.desde,'%H:%i') AS desde,
            date_format(r.hasta,'%H:%i') AS hasta,
            ifnull(r.descri,'') as descri,
            a.cod_uni as cod_uni_pro,
            a.nombre AS espacio,
            a.planta,
            u.nomb_uni AS unidad,
            e.nombre AS edificio,
            s.nombre AS sede,
            x.cod_uni,
            x.nomb_uni AS unidad_academica,
            ifnull(c.nomb_carr,'') AS carrera,
            ifnull(m.nom_mat,'') AS materia,
            ifnull(r.curso,'') as curso,
            ifnull(r.catedra,'') as catedra,
            ifnull(r.comision,'') as comision,
            ifnull(r.cod_prof,' -') AS cod_prof,
            concat(ifnull(d.apellido,' -'),' ',ifnull(d.nombre,' -')) AS docente,
            r.suspendida
        from (((((((((aulario_reserva r left join aulario_espacios a on(a.id = r.espacio_id and a.sis_anulado = 0)) left join aulario_edificios e on(e.id = a.edificio_id and e.sis_anulado = 0)) left join aulario_sedes s on(s.id = e.sede_id and s.sis_anulado = 0)) left join siuc_unidades u on(u.cod_uni = a.cod_uni)) left join siuc_unidades x on(x.cod_uni = r.cod_uni)) left join siuc_carreras c on(c.cod_uni = r.cod_uni and c.cod_carr = r.cod_car)) left join siuc_materias m on(m.cod_uni = r.cod_uni and m.cod_mat = r.cod_mate)) left join siuc_docentes d on(d.cod_prof = r.cod_prof)) left join usuarios uu on(uu.id = r.sis_usuario_id))
            where r.sis_anulado = 0
            and r.confirmada=1
        ) x
        where (x.cod_uni = '${data.cod_uni}' or cod_uni_pro='${data.cod_uni}')
        and x.fecha = '${data.fecha}'
        order by x.desde, x.materia
    `

    const filas = await dbSelect(sql, []);

    return json(filas)
    
}