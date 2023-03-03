import { json } from '@sveltejs/kit';
import { consulta } from '$lib/server/servicios/tipo_articulo';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {

    if(!locals.usuario || !locals.usuario.autorizado){
        return  json({error:true, mensaje: 'No tiene permiso para acceder a esta página'});
    }

    const { paginado, items } = await request.json();
    
    return json(await consulta(paginado, items))
}
