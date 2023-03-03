import { json } from '@sveltejs/kit';
import { consulta, leerId } from '$lib/server/servicios/espacios'

/** @type {import('./$types').RequestHandler} */ 
export async function GET({ url }) { 

    const espacio_id = url.searchParams.get('espacio_id')

    return json(await leerId(espacio_id));
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) { 

    const { paginado, items, cod_uni } = await request.json();

    if(!cod_uni){
        console.log('NO VIENE COD UNI')
    }else{
        console.log('COD UNI:', cod_uni)
    }
    // const filtro = await request.json() || []

    return json(await consulta(paginado, items, cod_uni));
}