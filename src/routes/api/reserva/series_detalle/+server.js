import { leer, borrar } from "$lib/server/servicios/series_detalle";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
  const serie = await leer(url.searchParams.get("serie") || "") || {};

  return json(serie);
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {
  const { reserva_id } = await request.json();
  console.log('BORRAR LA RESERVA ID:', reserva_id)
  console.log('CON EL USUAIRO ID:', locals.usuario.id)
  const result = await borrar(reserva_id, locals.usuario.id);

  return json(result);
}
