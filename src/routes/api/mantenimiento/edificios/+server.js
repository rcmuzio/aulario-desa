import { dbSelect } from '$lib/server/db';
import { json, error } from '@sveltejs/kit';
import { leer, agregar, modificar, borrar } from '$lib/server/servicios/edificios';
import { sin_permiso } from '$lib/server/constantes';


/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
    if(!locals.usuario || !locals.usuario.autorizado){
        return json(sin_permiso);
    }

    const id = url.searchParams.get('id') || 0;

    return json(await leer(id));
}


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    if(!locals.usuario || !locals.usuario.autorizado){
        return json(sin_permiso);
    }

    const datos = await request.json()

    const result = await agregar(datos, locals.usuario.id);

    return json(result)
}


/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, locals }) {
    if(!locals.usuario || !locals.usuario.autorizado){
        return json(sin_permiso);
    }
    
    const datos = await request.json()

    const result = await modificar(datos, locals.usuario.id);

    return json(result)
}


/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {
    if(!locals.usuario || !locals.usuario.autorizado){
        return json(sin_permiso);
    }

    const datos = await request.json();

    const result = await borrar(datos, locals.usuario.id);

    return json(result)
}