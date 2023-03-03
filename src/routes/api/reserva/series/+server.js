import { leer, agregar, modificar, borrar, borrar_detalle} from '$lib/server/servicios/series';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function GET({url, locals}) {

    const result = await leer(url.searchParams.get('serie')||'') || {}

    return json(result)
}


/** @type {import('./$types').RequestHandler} */
export async function POST({request, locals}) {

    const data = await request.json();
    const sis_usuario_id = locals.usuario.id || 99999;
    const result = await agregar(data, sis_usuario_id);

    console.log('RESULT DE AGERGAR RESERVA:', result)

    return json({error: false, serie: result})
}


export async function PUT({ request, locals }) {
    const params = await request.json()

    // BORRA LA SERIE
    let res_borrar = await borrar(params.serie, locals.usuario.id || 99999);

    // BORRA EL DETALLE DE LA SERIE
    let res_borrar_detalle = await borrar_detalle(params.serie, locals.usuario.id) || 99999;

    // AGREGA NUEVA SERIE
    const serie = await agregar(params, locals.usuario.id || 99999);

    return json({ error: false, serie })
}

export async function DELETE({ request, locals }) {
    const params = await request.json()
    
    let serie = await borrar(params.serie, locals.usuario.id || 99999);

    let detalle = await borrar_detalle(params.serie, locals.usuario.id || 99999);

    return json({
        error: false,
        serie,
        detalle,
    })
}
