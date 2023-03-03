import { dbAction } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, locals }) {
  const { reserva_id, espacio_id } = await request.json();
  const sis_usuario_id = locals.usuario.id || 66666;
  console.log("SIS_USUARIO_ID::", sis_usuario_id);

  let sql = `
        update aulario_reserva a set 
        a.espacio_id = '${espacio_id}' ,
        a.confirmada = 1,
        a.sp_actividad = 0,
        a.sp_docente = 0,
        a.sis_fecha = now(),
        a.sis_usuario_id =' ${sis_usuario_id}'
        where a.id = '${reserva_id}'
        and (
            select count(x.id)
            from aulario_reserva x
            where x.espacio_id = '${espacio_id}'
            and x.id != a.id
            and x.sis_anulado = 0
            and x.confirmada = 1
            and x.fecha = a.fecha 
            and (
                (a.desde <= x.desde and x.desde <= a.hasta) or (a.desde <= x.hasta and x.hasta <= a.hasta) or
                (a.desde <= x.desde and x.hasta <= a.hasta) or (a.desde >= x.desde and x.hasta >= a.hasta)
            )
        ) = 0
    `;

    console.log('SQL PARA CAMBIAR DE AULA:', sql)
  const update = await dbAction(sql, []);

  return json(update);
}
