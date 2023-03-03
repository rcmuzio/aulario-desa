// import { insertar, modificar, seleccionar } from "$lib/db/database"
// import { get_usuario_username } from "$lib/db/funciones"
import { dbAction, dbSelect } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
  let cod_uni = await url.searchParams.get("cod_uni") || "XX";
  let sis_usuario_id = locals.usuario.id || 1;

  let sql = `
        select *
        from aulario_reserva_param
        where cod_uni = ? 
        and sis_anulado=0
    `;

  let result = await dbSelect(sql, [cod_uni]);

  if (result[0].length == 0) {
    sql = `
            insert into aulario_reserva_param
                (cod_uni, sis_fecha, sis_usuario_id)
            values
                (?, now(), ?)
        `;
    let res = await dbAction(sql, [cod_uni, sis_usuario_id]);

    if (res.affectedRows > 0) {
      return json({ error: false, max_reserva_dia: 2 });
    } else {
      return json({
        error: true,
        mensaje: "No pudo insertar registro.",
        max_reserva_dia: 2,
      });
    }
  }

  return json({ error: false, filas: result[0], max_reserva_dia: 99 });
}

export async function POST({ request, locals }) {
  const { cod_uni, max_reserva_dia } = await request.json();

  let sis_usuario_id = locals.usuario.id || 1;

  let sql = `
        update aulario_reserva_param set
            max_reserva_dia = ?,
            sis_fecha = now(),
            sis_usuario_id = ?
        where cod_uni = ?
        and sis_anulado = 0
    `;

  const result = await dbAction(sql, [
    max_reserva_dia,
    sis_usuario_id,
    cod_uni,
  ]);

  if (result.affectedRows > 0) {
    return json({
      error: false,
      mensaje: "El parámetro se actualizó con éxito.",
    });
  }

  return json({
    error: true,
    mensaje: "El parámetro NO se pudo actualizar.",
  });
}
