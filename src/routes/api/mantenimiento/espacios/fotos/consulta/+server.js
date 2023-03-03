import { json } from '@sveltejs/kit'
import { consultar } from '$lib/server/servicios/espacios_fotos'


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {

    const { id } = await request.json() || 0

    const fotos = await consultar(id)
    return json(fotos)

}