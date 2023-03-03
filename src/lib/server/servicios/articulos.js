import { dbAction, dbSelect } from "../db";

//-----------------------------------------
// funciones

function corregir(datos) {
    datos.nombre = datos.nombre.toUpperCase().trim();
    return datos;
}

async function registro_existente(datos) {

    const { id, tipo_id, nombre } = datos;

    const sql = `
        select *
        from aulario_articulos
        where id != ?
        and tipo_id = ?
        and nombre = ?
        and sis_anulado = 0
    `
    const existe = await dbSelect(sql, [id, tipo_id, nombre])

    return existe.length;
}

async function existen_dependencias(datos) {

    const { id } = datos;

    const sql = `
        select *
        from aulario_espacios_articulos
        where articulo_id = ?
        and sis_anulado = 0
    `
    const existen = await dbSelect(sql, [id])

    return existen.length;
}

//-----------------------------------------
// servicios

export async function consulta (paginado, items){
    
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

    return {
        filas:result,
        paginado,
    };
}

export async function leer(id){
    const sql = `
        select *
        from aulario_v_articulos
        where id = ?
    `

    const result = await dbSelect(sql, [id]);

    return {
        error: false,
        fila: result.length>0 ? result[0] : {
            id: 0,
            tipo_id: 0,
            tipo: '',
            nombre: '',
        }
    }
}

export async function agregar(datos, sis_usuario_id) {
    datos = corregir(datos);

    const { id, tipo_id, nombre } = datos;

    const existe = await registro_existente(datos);

    if (existe) {
        return {
            error: true,
            mensaje: 'Ya existe un artículo con el mismo nombre.'
        }
    }

    let sql = `
        insert into aulario_articulos 
            ( tipo_id, nombre, sis_usuario_id, sis_fecha)
        values
            (?, ?, ?, now())
    `

    let result = await dbAction(sql, [tipo_id, nombre, sis_usuario_id])

    return result
}

export async function modificar(datos, sis_usuario_id) {
    datos = corregir(datos);

    const { id, tipo_id, nombre } = datos;

    const existe = await registro_existente(datos);

    if (existe) {
        return {
            error: true,
            mensaje: 'Ya existe un artículo con el mismo nombre.'
        }
    }

    let sql = `
        update aulario_articulos set
            tipo_id = ?,
            nombre = ?,
            sis_usuario_id = ?,
            sis_fecha = now()
        where id = ?
    `

    let result = await dbAction(sql, [tipo_id, nombre, sis_usuario_id, id])

    return result
}

export async function borrar(datos, sis_usuario_id) {
    const { id } = datos;

    const existen = await existen_dependencias(datos);

    if (existen) {
        return {
            error: true,
            mensaje: 'No se puede borrar, existen Espacios relacionados.'
        }
    }

    let sql = `
        update aulario_articulos set
            sis_anulado = 1,
            sis_usuario_id = ?,
            sis_fecha = now()
        where id = ?
    `

    let result = await dbAction(sql, [sis_usuario_id, id])

    return result
}