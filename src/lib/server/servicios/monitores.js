import { dbSelect, dbAction } from "$lib/server/db";

//----------------------------------------------------------------------
// funciones

function corregir(datos) {
    datos.planta = datos.planta.toUpperCase().trim();
    datos.monitor = datos.monitor.toUpperCase().trim();
    datos.descri = datos.descri.trim();
    return datos;
}

async function existente(datos) {

    const { id, edificio_id, monitor, planta, cod_uni } = datos;

    const sql = `
        select *
        from aulario_monitores
        where id != ?
        and edificio_id = ?
        and monitor = ?
        and planta = ?
        and cod_uni = ?
        and sis_anulado = 0
    `
    const existe = await dbSelect(sql, [id, edificio_id, monitor, planta, cod_uni])

    return existe.length;
}

//----------------------------------------------------------------------
// servicios

export async function consulta(paginado, items) {
    let condi = ' where ';
    let param = [];

    items.map((i) => {
        switch (i.name) {
            case 'sede':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
            case 'edificio':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
            case 'planta':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
            case 'monitor':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
            case 'unidad':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
        }
    })

    condi += " id > 0";

    let sql = `
        select count(*) as registros
        from aulario_v_monitores
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
        from aulario_v_monitores
        ${condi}
        order by sede, edificio, planta, monitor
        limit ${inicio}, ${paginado.rxp}
    `

    result = await dbSelect(sql, param)

    return {
        filas: result,
        paginado,
    };
}


export async function leer(id) {

    const sql = `
        select *
        from aulario_v_monitores
        where id = ?
    `
    const param = [id]

    const result = await dbSelect(sql, param)

    console.log('LEER EDIFICIO:', result[0])

    if (result.length > 0) {
        return result[0]
    } else {
        return {
            id: 0,
            sede_id: 0,
            sede: '',
            edificio: ''
        }
    }

}


export async function agregar(datos, sis_usuario_id) {
    datos = corregir(datos);

    const { id, edificio_id, monitor, planta, cod_uni, descri } = datos;

    const existe = await existente(datos);

    if (existe) {
        return {
            error: true,
            mensaje: 'Ya existe un monitor con los mismos datos.'
        }
    }

    let sql = `
        insert into aulario_monitores
            ( edificio_id, monitor, planta, cod_uni, descri, sis_usuario_id, sis_fecha)
        values
            (?, ?, ?, ?, ?, ?, now())
    `

    let result = await dbAction(sql, [edificio_id, monitor, planta, cod_uni, descri, sis_usuario_id])

    return result
}


export async function modificar(datos, sis_usuario_id) {
    datos = corregir(datos);

    const { id, edificio_id, monitor, planta, cod_uni, descri, sis_vigente  } = datos;

    const existe = await existente(datos);

    if (existe) {
        return {
            error: true,
            mensaje: 'Ya existe un monitor con el mismo nombre.'
        }
    }

    let sql = `
        update aulario_monitores set
            edificio_id = ?,
            monitor = ?,
            planta = ?,
            cod_uni = ?,
            descri = ?,
            sis_vigente = ?,
            sis_usuario_id = ?,
            sis_fecha = now()
        where id = ?
    `

    let result = await dbAction(sql, [edificio_id, monitor, planta, cod_uni, descri, sis_vigente, sis_usuario_id, id])

    return result
}

export async function borrar(id, sis_usuario_id) {

    let sql = `
        update aulario_monitores set
            sis_anulado = 1,
            sis_usuario_id = ?,
            sis_fecha = now()
        where id = ?
    `

    let result = await dbAction(sql, [sis_usuario_id, id])

    return result
}