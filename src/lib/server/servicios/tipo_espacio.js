import { dbSelect, dbAction } from "$lib/server/db";


// --------------------------------------------------------------------
// funciones

function corregir(datos) {
    datos.tipo_espacio = datos.tipo_espacio.toUpperCase().trim();
    return datos;
}

async function registro_existente(datos) {

    const { id, tipo_espacio } = datos;

    const sql = `
        select *
        from aulario_tipo_espacio
        where id != ?
        and tipo_espacio = ?
        and sis_anulado = 0
    `
    const existe = await dbSelect(sql, [id, tipo_espacio])

    return existe.length;
}

async function existen_dependencias(datos) {

    const { id } = datos;

    const sql = `
        select *
        from aulario_espacios
        where tipo_espacio = ?
        and sis_anulado = 0
    `
    const existen = await dbSelect(sql, [id])

    return existen.length;
}

// --------------------------------------------------------------------
// servicios

export async function consulta(paginado, items) {

    let condi = ' where ';
    let param = [];

    items.map((i) => {
        switch (i.name) {
            case 'tipo_espacio':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
            case 'reserva_desc':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
        }
    })

    condi += " id > 0";

    let sql = `
        select count(*) as registros
        from aulario_v_tipo_espacio
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
        from aulario_v_tipo_espacio
        ${condi}
        order by tipo_espacio
        limit ${inicio}, ${paginado.rxp}
    `

    result = await dbSelect(sql, param)

    return {
        filas: result,
        paginado,
    };
}

export async function leer(id) {
    let sql = `
        select *
        from aulario_v_tipo_espacio
        where id = ?
    `

    let result = await dbSelect(sql, [id]);

    return {
        error: false,
        fila: result.length > 0 ? result[0] : { id: 0, tipo_espacio: '' }
    }
}

export async function agregar(datos, sis_usuario_id) {
    datos = corregir(datos);

    const { id, tipo_espacio } = datos;

    const existe = await registro_existente(datos);

    if (existe) {
        return {
            error: true,
            mensaje: 'Ya existe un tipo de espacio con el mismo nombre.'
        }
    }

    let sql = `
        insert into aulario_tipo_espacio
            ( tipo_espacio, sis_usuario_id, sis_fecha)
        values
            (?, ?, now())
    `

    let result = await dbAction(sql, [tipo_espacio, sis_usuario_id]);

    return result
}


export async function modificar(datos, sis_usuario_id) {
    datos = corregir(datos);

    const { id, tipo_espacio } = datos;

    const existe = await registro_existente(datos);

    if (existe) {
        return {
            error: true,
            mensaje: 'Ya existe un tipo de espacio con el mismo nombre.'
        }
    }

    let sql = `
        update aulario_tipo_espacio set
            tipo_espacio = ?,
            sis_usuario_id = ?,
            sis_fecha = now()
        where id = ?
    `

    let result = await dbAction(sql, [tipo_espacio, sis_usuario_id, id])

    return result
}

export async function borrar(datos, sis_usuario_id) {

    const existen = await existen_dependencias(datos);

    if (existen) {
        return {
            error: true,
            mensaje: 'No se puede borrar, existen Espacios relacionados.'
        }
    }

    let sql = `
        update aulario_tipo_espacio set
            sis_anulado = 1,
            sis_usuario_id = ?,
            sis_fecha = now()
        where id = ?
    `

    let result = await dbAction(sql, [sis_usuario_id, datos.id])

    return result
}