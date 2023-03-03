import { dbAction, dbSelect } from "../db";

export async function leer(serie) {
  let sql = `
    select *
    from aulario_v_reserva
    where serie = ?
    order by fecha, desde
`;

  let filas = await dbSelect(sql, [serie]);

  return filas;
}


export async function borrar(reserva_id, sis_usuario_id){
  let sql = `
    update aulario_reserva set
      sis_anulado = 1,
      sis_usuario_id = ?,
      sis_fecha = now()
    where id = ?
  `

  const result = await dbAction(sql, [sis_usuario_id, reserva_id])

  return result;
}
