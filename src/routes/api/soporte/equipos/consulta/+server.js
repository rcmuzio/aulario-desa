import { consulta } from '$lib/server/servicios/equipos';
import { json, error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {

    if(!locals.usuario || !locals.usuario.autorizado){
        return  json({error:true, mensaje: 'No tiene permiso para acceder a esta página'});
    }

    const { paginado, items } = await request.json();

    const result = await consulta(paginado, items)

    return json(result);
}
