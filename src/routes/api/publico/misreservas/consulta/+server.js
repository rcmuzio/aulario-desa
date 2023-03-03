import { dbSelect } from "$lib/server/db"
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {

    const { paginado, items } = await request.json();
    console.log('ITEMS:', items)

    let condi = '';
    let param = [locals.usuario.username || 'XXXXXXX'];

    items.map((i) => {
        switch (i.name) {
            case 'fecha':
                condi += " and " + i.name + " like concat('%',?,'%')  ";
                param.push(i.filtro)
                break;
            case 'sede':
                condi += " and " +i.name + " like concat('%',?,'%')  ";
                param.push(i.filtro)
                break;
            case 'edificio':
                condi += " and "+i.name + " like concat('%',?,'%')  ";
                param.push(i.filtro)
                break;
            case 'espacio':
                condi += "and " +i.name + " like concat('%',?,'%')  ";
                param.push(i.filtro)
                break;
        }
    })


    let sql = `
        select count(id) as registros 
        from aulario_v_reserva_ocupada
        where username = ?
        ${condi}
    `;

    let result = await dbSelect(sql, param)

    let registros = parseInt(result[0].registros);

    paginado.registros = registros;

    if (paginado.rxp > registros) {
        paginado.pagina = 1;
        paginado.paginas = 1;
    } else {
        paginado.paginas = parseInt(registros / paginado.rxp);
        if ((registros / paginado.rxp) > paginado.paginas) paginado.paginas++
    }

    if (paginado.pagina > paginado.paginas) paginado.pagina = paginado.paginas;

    let inicio = (paginado.pagina - 1) * paginado.rxp;

    sql = `
        select *
        from aulario_v_reserva_ocupada
        where username = ?
        ${condi}
        order by fecha, desde
        limit ${inicio},${paginado.rxp}
    `;

    result = await dbSelect(sql, param)

    return json({
        filas: result,
        paginado,
    })

}


