import { dbSelect } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  let edificio = url.searchParams.get("edificio") || "";
  let planta = url.searchParams.get("planta") || "";
  let monitor = url.searchParams.get("monitor") || "";

  let sql = `
        select *
        from aulario_v_monitores
        where edificio = '${edificio}'
        and planta = '${planta}'
        and monitor = '${monitor}'
    `;

  let filas = await dbSelect(sql, []);

  return json(filas);
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const data = await request.json();

  const sql = `
        select id, desde, hasta, sede, edificio, espacio, planta, unidad, unidad_academica, carrera, materia, docente, catedra, comision, descri,
        ifnull(upper(concat(carrera,' / ',materia, ' (', catedra,') (', comision, ') / ', docente, ' / ', descri)), descri) as actividad,
        date_format(now(), '%H:%i') as ahora, suspendida
        from aulario_v_reserva
        where (cod_uni = '${data.cod_uni}' or key_uni='${data.cod_uni}')
        and fecha = '${data.fecha}'
        order by desde
    `;

  const filas = await dbSelect(sql, []);

  return json(filas);
}
