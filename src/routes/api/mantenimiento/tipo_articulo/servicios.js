import { dbAction, dbSelect } from "$lib/server/db";

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