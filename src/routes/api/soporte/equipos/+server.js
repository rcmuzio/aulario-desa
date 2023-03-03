import { json, error } from '@sveltejs/kit';
import { leer, agregar, modificar, borrar } from '$lib/server/servicios/equipos';



/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {

    if (!locals.usuario || !locals.usuario.autorizado) {
        return json({
            error: true,
            mensaje: 'No tiene permiso para acceder a esta página.'
        })
    }

    const id = url.searchParams.get('id');

    return json(await leer(id));
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    if(!locals.usuario || !locals.usuario.autorizado){
        return json({
            error: true,
            mensaje: 'No tiene permiso para acceder a esta página.'
        })
    }
    
    const data = await request.json();

    return json(await agregar(data, locals.usuario.id || 9999));
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, locals }) {
    if(!locals.usuario || !locals.usuario.autorizado){
        return json({
            error: true,
            mensaje: 'No tiene permiso para acceder a esta página.'
        })
    }
    
    const data = await request.json();

    return json(await modificar(data, locals.usuario.id || 9999));
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {
    if(!locals.usuario || !locals.usuario.autorizado){
        return json({
            error: true,
            mensaje: 'No tiene permiso para acceder a esta página.'
        })
    }
    
    const data = await request.json();

    return json(await borrar(data.id, locals.usuario.id || 9999));
}