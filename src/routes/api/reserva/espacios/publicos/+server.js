import Paginado from '$lib/components/reserva/paginado.svelte';
import { consulta } from '$lib/server/servicios/espacios_publicos';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    if(!locals.usuario || !locals.usuario.autorizado){
        return json(sin_permiso);
    }

    const {paginado, items, cod_uni, anio} = await request.json()

    console.log(`cod_uni:${cod_uni} anio:${anio}`)

    const result = await consulta(paginado, items, cod_uni, anio) 

    return json({error: false, mensaje:'solicitud recibida', ...result})
}
