import { sin_permiso } from "$lib/server/constantes";
import { dbSelect } from "$lib/server/db";
import { json, error } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {

    const { paginado, items, fecha } = await request.json();

    let condi = '';
    let param = [fecha];

    if (items && items.length > 0) {
        items.map((i) => {
            if (i.filtro.trim().length > 0) {
                switch (i.name) {
                    case 'unidad':
                        condi += `and ${i.name} like concat('%',?,'%') `;
                        param.push(i.filtro);
                        break;
                    case 'carrera':
                        condi += `and ${i.name} like concat('%',?,'%') `;
                        param.push(i.filtro);
                        break;
                    case 'materia':
                        condi += `and ${i.name} like concat('%',?,'%') `;
                        param.push(i.filtro);
                        break;
                    case 'descri':
                        condi += `and ${i.name} like concat('%',?,'%') `;
                        param.push(i.filtro);
                        break;
                    case 'horario':
                        condi += `and ${i.name} like concat('%',?,'%') `;
                        param.push(i.filtro);
                        break;
                    case 'sede':
                        condi += `and ${i.name} like concat('%',?,'%') `;
                        param.push(i.filtro);
                        break;
                    case 'edificio':
                        condi += `and ${i.name} like concat('%',?,'%') `;
                        param.push(i.filtro);
                        break;
                    case 'espacio':
                        condi += `and ${i.name} like concat('%',?,'%') `;
                        param.push(i.filtro);
                        break;
                    case 'planta':
                        condi += `and ${i.name} like concat('%',?,'%') `;
                        param.push(i.filtro);
                        break;

                }
            }
        })

    }

    let sql = `
        select count(id) as registros
        from aulario_v_reserva
        where fecha = ?
        ${condi}
    `

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
        from aulario_v_reserva
        where fecha = ?
        ${condi}
        order by carrera, concat(materia,descri), horario
        limit ${inicio}, ${paginado.rxp}
    `

    const filas = await dbSelect(sql, param)

    return json({
        error: false,
        mensaje: '',
        paginado,
        filas
    })
}