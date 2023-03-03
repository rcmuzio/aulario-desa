import { dbSelect, dbAction } from "$lib/server/db";

// --------------------------------------------------------------------
// funciones

function limpiar(data) {
    [
        { campo: 'nombre', upper: true },
        { campo: 'marca', upper: true },
        { campo: 'modelo', upper: true }
    ].map((d) => {
        data[d.campo] = data[d.campo].trim();
        if (d.upper) data[d.campo] = data[d.campo].toUpperCase();
    })

    return data;
}

async function existente(data) {
    let sql = `
        select *
        from aulario_equipos 
        where id != ?
        and nombre = ?
        and marca = ?
        and modelo = ?
        and sis_anulado = 0
    `

    let result = await dbSelect(sql, [data.id, data.nombre, data.marca, data.modelo]);

    return result.length > 0;
}

async function hijos(id) {
    let sql = `
        select *
        from aulario_espacios_equipos
        where equipo_id = ?
        and sis_anulado = 0
    `

    const result = await dbSelect(sql, [id]);

    return result.length > 0;
}

// --------------------------------------------------------------------
// servicios

export async function consulta(paginado, items) {
    let condi = '';
    let param = [];

    items.map((i) => {
        switch (i.name) {
            case 'nombre':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
            case 'marca':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
            case 'modelo':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
            case 'descri':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
            case 'sis_vigente_txt':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
        }
    })

    condi = condi.length > 0 ? ' where ' + condi.substring(0, condi.length - 4) : '';

    let sql = `
        select count(*) as registros
        from aulario_v_equipos
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
        from aulario_v_equipos
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
        from aulario_v_equipos
        where id = ?
    `

    let result = await dbSelect(sql, [id]);

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
            mensaje: 'Ya existe una Equipo con el mismno Nombre, Modelo y Marca.'
        }
    }

    let sql = `
        insert into aulario_equipos 
            (nombre, marca, modelo, descri, sis_usuario_id, sis_fecha)
        values
            (?, ?, ?, ?, ?, now())
    `

    const result = await dbAction(sql, [data.nombre, data.marca, data.modelo, data.descri, sis_usuario_id]);

    return result;
}


export async function modificar(data, sis_usuario_id) {
    data = limpiar(data);

    if (await existente(data)) {
        return {
            error: true,
            mensaje: 'Ya existe una Equipo con el mismno Nombre, Modelo y Marca.'
        }
    }

    let sql = `
        update aulario_equipos set
            nombre = ?,
            marca = ?,
            modelo = ?,
            descri = ?,
            sis_vigente = ?,
            sis_usuario_id = ?,
            sis_fecha = now()
        where id = ?
    `
    const result = await dbAction(sql, [data.nombre, data.marca, data.modelo, data.descri, data.sis_vigente, sis_usuario_id, data.id]);

    return result;
}


export async function borrar(id, sis_usuario_id) {
    if (await hijos(id)) {
        return {
            error: true,
            mensaje: 'No puede borrar el Equipo, tiene registros relacionados en Equipamiento instalado.'
        }
    }

    let sql = `
        update aulario_equipos set
            sis_anulado = 1,
            sis_usuario_id = ?,
            sis_fecha = now()
        where id = ?
    `
    const result = await dbAction(sql, [sis_usuario_id, id]);

    return result;
}