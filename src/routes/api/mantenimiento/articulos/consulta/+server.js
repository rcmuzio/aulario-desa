import { dbSelect } from '$lib/server/db';
import { json, error } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {

    if(!locals.usuario || !locals.usuario.autorizado){
        return  json({error:true, mensaje: 'No tiene permiso para acceder a esta página'});
    }

    const { paginado, items } = await request.json();

    let condi = ' where ';
    let param = [];

    items.map((i) => {
        switch (i.name) {
            case 'tipo':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
            case 'nombre':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
        }
    })

    condi += " id>0";

    let sql = `
        select count(*) as registros
        from aulario_v_articulos
        ${condi}
    `

    let result = await dbSelect(sql, param)

    let registros = parseInt(result[0].registros);

    paginado.registros = registros;
    
    if (paginado.rxp > registros) {
        paginado.pagina = 1;
        paginado.paginas = 1;
    }else{
        paginado.paginas = parseInt(registros / paginado.rxp);
        if((registros / paginado.rxp)>paginado.paginas) paginado.paginas++
    }

    if(paginado.pagina>paginado.paginas) paginado.pagina = paginado.paginas;

    let inicio = (paginado.pagina - 1) * paginado.rxp;

    sql = `
        select *
        from aulario_v_articulos
        ${condi}
        order by tipo, nombre
        limit ${inicio}, ${paginado.rxp}
    `

    result = await dbSelect(sql, param)

    return json({
        filas:result,
        paginado,
    });
}
