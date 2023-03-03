import { dbSelect } from "$lib/server/db";
import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, params }) {
  const reserva_id = url.searchParams.get("id") || 0;

  if (reserva_id == 0) throw error(404, "Not found");

  const sql = `
        select *
        from aulario_v_reserva 
        where id = ?
    `;

  const param = [reserva_id];

  const result = await dbSelect(sql, param);

  const reserva = result.length > 0 ? result[0] : {};

  return { reserva };
}
