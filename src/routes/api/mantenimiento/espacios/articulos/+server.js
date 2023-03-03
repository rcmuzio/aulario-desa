import { sin_permiso } from "$lib/server/constantes";
import { consulta, agregar, modificar, borrar } from "$lib/server/servicios/espacios_articulos";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    const espacio_id = url.searchParams.get('espacio_id') || 0;

    // console.log('ESPACIO_ID::::', espacio_id)
    // const sql = `
    //     select *
    //     from aulario_v_espacios_articulos
    //     where espacio_id = ?
    //     order by tipo, articulo
    // `

    // const result = await dbSelect(sql, [espacio_id]);

    return json({ error: false, filas: await consulta(espacio_id) });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    const datos = await request.json()

    return json(await agregar(datos, locals.usuario.id))
}


/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, locals }) {
    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    const datos = await request.json()

    return json(await modificar(datos, locals.usuario.id))
}


/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals }) {
    if (!locals.usuario || !locals.usuario.autorizado) {
        return json(sin_permiso);
    }

    const {id} = await request.json()

    return json(await borrar(id, locals.usuario.id))
}