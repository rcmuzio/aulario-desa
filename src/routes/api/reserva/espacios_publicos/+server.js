import { sin_permiso } from '$lib/server/constantes';
import { agregar, borrar } from '$lib/server/servicios/espacios_publicos';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    const { id } = await request.json();

    const result = await agregar(id, locals.usuario.id)

    return json(result);
}


/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {
    if(!locals.usuario || !locals.usuario.autorizado){
        return json(sin_permiso);
    }

    const data = await request.json()

    const result = await borrar(data, locals.usuario.id) 

    return json(result)
}


/** @type {import('./$types').RequestHandler} */
// export async function PUT({ request, locals }) {

//     if (!locals.usuario || !locals.usuario.autorizado) {
//         return json(sin_permiso);
//     }

//     const {cod_uni, max_reserva_dia} = await request.json();

//     const result = await modificar(cod_uni, max_reserva_dia, locals.usuario.id)

//     return json(result)
// }