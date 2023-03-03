import { dbSelect, dbAction } from "$lib/server/db";

//----------------------------------------------------------------------
// funciones

function corregir(datos) {
    datos.nombre = datos.nombre.toUpperCase().trim();
    return datos;
}

async function existe_edificio(datos) {

    const { id, sede_id, nombre } = datos;

    const sql = `
        select *
        from aulario_edificios
        where id != ?
        and sede_id = ?
        and nombre = ?
        and sis_anulado = 0
    `
    const existe = await dbSelect(sql, [id, sede_id, nombre])

    return existe.length;
}

async function existen_dependencias(datos){

    const { id } = datos;

    const sql = `
        select *
        from aulario_espacios
        where edificio_id = ?
        and sis_anulado = 0
    `
    const existen = await dbSelect(sql, [id])

    return existen.length;
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
        }
    })

    condi += " sis_anulado = 0";

    let sql = `
        select count(*) as registros
        from aulario_v_edificios
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
        from aulario_v_edificios
        ${condi}
        order by sede, edificio
        limit ${inicio}, ${paginado.rxp}
    `

    result = await dbSelect(sql, param)

    return {
        filas: result,
        paginado,
    };
}


export async function leer(id){
   
    const sql = `
        select *
        from aulario_v_edificios
        where id = ?
    `
    const param = [id]

    const result = await dbSelect(sql, param)

    console.log('LEER EDIFICIO:', result[0])

    if(result.length>0){
        return result[0]
    }else{
        return {
            id:0,
            sede_id:0,
            sede:'',
            edificio:''
        }
    }

}


export async function agregar(datos, sis_usuario_id){
    datos = corregir(datos);

    const { id, sede_id, nombre } = datos;

    const existe = await existe_edificio(datos);
    
    if(existe){
        return {
            error: true,
            mensaje: 'Ya existe un edificio con el mismo nombre.'
        }
    }

    let sql = `
        insert into aulario_edificios 
            ( sede_id, nombre, sis_usuario_id, sis_fecha)
        values
            (?, ?, ?, now())
    `

    let result = await dbAction(sql, [sede_id, nombre, sis_usuario_id])

    return result
}


export async function modificar(datos, sis_usuario_id) {
    datos = corregir(datos);

    const { id, sede_id, nombre } = datos;

    const existe = await existe_edificio(datos);
    
    if(existe){
        return {
            error: true,
            mensaje: 'Ya existe un edificio con el mismo nombre.'
        }
    }

    let sql = `
        update aulario_edificios set
            sede_id = ?,
            nombre = ?,
            sis_usuario_id = ?,
            sis_fecha = now()
        where id = ?
    `

    let result = await dbAction(sql, [sede_id, nombre, sis_usuario_id, id])

    return result
}

export async function borrar(datos, sis_usuario_id) {
    const { id } = datos;

    const existen = await existen_dependencias(datos);
    
    if(existen){
        return {
            error: true,
            mensaje: 'No se puede borrar, existen Espacios relacionados.'
        }
    }

    let sql = `
        update aulario_edificios set
            sis_anulado = 1,
            sis_usuario_id = ?,
            sis_fecha = now()
        where id = ?
    `

    let result = await dbAction(sql, [sis_usuario_id, id])

    return result
}