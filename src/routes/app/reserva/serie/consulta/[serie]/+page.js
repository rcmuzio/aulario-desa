import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  if (!params.serie) throw error(404, "Not found");
  return {
    serie: params.serie,
  };
}
