import { json } from '@sveltejs/kit';
import { consulta } from '$lib/server/servicios/articulos'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) { 

    const { paginado, items } = await request.json();

    return json(await consulta(paginado, items));
}