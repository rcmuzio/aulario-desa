import { dbAction } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const {
    rxp,
    vista,
    segundos,
    actividad_por_planta,
    font_size,
    mostrar,
    ancho_columna,
    id,
  } = await request.json();

  let sql = `
        update aulario_monitores set
        rxp = '${rxp}',
        vista = '${vista}' ,
        segundos = '${segundos}',
        font_size = '${font_size}',
        mostrar = '${mostrar}',
        ancho_columna = '${ancho_columna}',
        actividad_por_planta = '${actividad_por_planta}'
        where id ='${id}'
    `;

  console.log("GUARDARE CONFIGURACION MONITOR", sql);

  let result = await dbAction(sql, []);

  return json(result);
}
