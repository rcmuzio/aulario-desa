import { dbAction, dbSelect } from "../db";

//-----------------------------------------
// funciones

function corregir(datos) {
    datos.nombre = datos.nombre.toUpperCase().trim();
    return datos;
}

async function registro_existente(datos) {

    const { id, nombre } = datos;

    const sql = `
        select *
        from aulario_tipo_articulo
        where id != ?
        and nombre = ?
        and sis_anulado = 0
    `
    const existe = await dbSelect(sql, [id, nombre])

    return existe.length;
}

async function existen_dependencias(datos){

    const { id } = datos;

    const sql = `
        select *
        from aulario_articulos
        where tipo_id = ?
        and sis_anulado = 0
    `
    const existen = await dbSelect(sql, [id])

    return existen.length;
}

//-----------------------------------------
// servicios

export async function consulta(paginado, items){
    let condi = ' where ';
    let param = [];

    items.map((i) => {
        switch (i.name) {
            case 'nombre':
                condi += i.name + " like concat('%',?,'%') and ";
                param.push(i.filtro)
                break;
        }
    })

    condi += " id > 0";

    let sql = `
        select count(*) as registros
        from aulario_v_tipo_articulo
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
        from aulario_v_tipo_articulo
        ${condi}
        order by nombre
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
        from aulario_v_tipo_articulo
        where id = ?
    `
    const result = await dbSelect(sql, [id])

    if(result.length==0){
        return {error: false, fila: {id:0, nombre: ''}}
    }else{
        return {error: false, fila: result[0]}
    }
    

}

export async function agregar(datos, sis_usuario_id){
    datos = corregir(datos);

    const { id, nombre } = datos;

    const existe = await registro_existente(datos);
    
    if(existe){
        return {
            error: true,
            mensaje: 'Ya existe un tipo de artículo con el mismo nombre.'
        }
    }

    let sql = `
        insert into aulario_tipo_articulo
            ( nombre, sis_usuario_id)
        values
            (?, ?)
    `

    let result = await dbAction(sql, [ nombre, sis_usuario_id])

    return result
}

export async function modificar(datos, sis_usuario_id) {
    datos = corregir(datos);

    const { id, nombre } = datos;

    const existe = await registro_existente(datos);
    
    if(existe){
        return {
            error: true,
            mensaje: 'Ya existe un tipo de artículo con el mismo nombre.'
        }
    }

    let sql = `
        update aulario_tipo_articulo set
            nombre = ?,
            sis_usuario_id = ?
        where id = ?
    `

    let result = await dbAction(sql, [ nombre, sis_usuario_id, id])

    return result
}

export async function borrar(datos, sis_usuario_id) {
    const { id } = datos;

    const existen = await existen_dependencias(datos);
    
    if(existen){
        return {
            error: true,
            mensaje: 'No se puede borrar, existen Artículos relacionados.'
        }
    }

    let sql = `
        update aulario_tipo_articulo set
            sis_anulado = 1, sis_usuario_id = ?
        where id = ?
    `

    let result = await dbAction(sql, [sis_usuario_id, id])

    return result
}