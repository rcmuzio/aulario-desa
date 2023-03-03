import { dbSelect } from "$lib/server/db";

// --------------------------------------------------------------------
// servicios

export async function consulta(paginado, items) {
    let condi = ' where ';
    let param = [];

    items.map((i) => {
        switch (i.name) {
            case 'nomb_uni':
                condi += i.name + " like concat('%',?,'%')  ";
                param.push(i.filtro)
                break;
        }
    })

    // condi += " sis_anulado = 0";

    let sql = `
        select count(*) as registros
        from siuc_unidades
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
        from siuc_unidades
        ${condi}
        order by nomb_uni
        limit ${inicio}, ${paginado.rxp}
    `

    result = await dbSelect(sql, param)

    return {
        filas: result,
        paginado,
    };
}