import { dbSelect, dbAction } from "$lib/server/db";

// --------------------------------------------------------------------
// funciones

function limpiar(data) {
    [
        { campo: 'nombre', upper: true },
        { campo: 'descri', upper: false }
    ].map((d) => {
        data[d.campo] = data[d.campo].trim();
        if (d.upper) data[d.campo] = data[d.campo].toUpperCase();
    })

    return data;
}

async function existente(data) {
    let sql = `
        select *
        from aulario_sedes 
        where id != ?
        and nombre = ?
        and sis_anulado = 0
    `

    let result = await dbSelect(sql, [data.id, data.nombre]);

    return result.length > 0;
}

async function hijos(id) {
    let sql = `
        select *
        from aulario_edificios
        where sede_id = ?
        and sis_anulado = 0
    `

    const result = await dbSelect(sql, [id]);

    return result.length > 0;
}

// --------------------------------------------------------------------
// servicios

export async function consulta(paginado, items) {
    let condi = ' where ';
    let param = [];

    items.map((i) => {
        switch (i.name) {
            case 'nombre':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
            case 'descri':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
        }
    })

    condi += " sis_anulado = 0";

    let sql = `
        select count(*) as registros
        from aulario_sedes
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
        from aulario_v_sedes
        ${condi}
        order by nombre
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
        from aulario_v_sedes
        where id = ?
    `

    let result = await dbSelect(sql, [id]);

    console.log('LEER::', result)
    return {
        error: false,
        fila: result.length > 0 ? result[0] : {
            id: 0,
            nombre: '',
            descri: ''
        }
    }
}


export async function agregar(data, sis_usuario_id) {

    data = limpiar(data);

    if (await existente(data)) {
        return {
            error: true,
            mensaje: 'Ya existe una Sede con el mismno Nombre.'
        }
    }

    let sql = `
        insert into aulario_sedes 
            (nombre, descri, sis_usuario_id, sis_fecha)
        values
            (?, ?, ?, now())
    `

    const result = await dbAction(sql, [data.nombre, data.descri, sis_usuario_id]);

    return result;
}


export async function modificar(data, sis_usuario_id) {
    data = limpiar(data);

    if (await existente(data)) {
        return {
            error: true,
            mensaje: 'Ya existe una Sede con el mismno Nombre.'
        }
    }

    let sql = `
        update aulario_sedes set
            nombre = ?,
            descri = ?,
            sis_usuario_id = ?,
            sis_fecha = now()
        where id = ?
    `
    const result = await dbAction(sql, [data.nombre, data.descri, sis_usuario_id, data.id]);

    return result;
}


export async function borrar(id, sis_usuario_id) {
    if (await hijos(id)) {
        return {
            error: true,
            mensaje: 'No puede borrar el regisgro, existen Edificios y/o Áreas relacionadas.'
        }
    }

    let sql = `
        update aulario_sedes set
            sis_anulado = 1,
            sis_usuario_id = ?,
            sis_fecha = now()
        where id = ?
    `
    const result = await dbAction(sql, [sis_usuario_id, id]);

    return result;
}


export async function borrar_detalle(serie, sis_usuario_id) {

    let sql = `
        update aulario_reserva set
        sis_anulado = 1,
        sis_usuario_id = '${sis_usuario_id}',
        sis_fecha = now()
        where serie = '${serie}'    
    `

    // console.log('BORRAR_DETALLE:', sql)
    let res = await dbAction(sql, []);

    return res;
}