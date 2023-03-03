import { dbAction, dbSelect } from "../db";
//-----------------------------------------
// funciones
async function existente(id, espacio_id, equipo_id) {
    let sql = `
        select count(id) as registros
        from aulario_v_espacios_equipos
        where id != ?
        and espacio_id = ?
        and equipo_id = ?
    `
    const result = await dbSelect(sql, [id, espacio_id, equipo_id])

    return result[0].registros > 0;
}


//-----------------------------------------
// servicios
export async function consulta(espacio_id) {
    const sql = `
        select *
        from aulario_v_espacios_equipos
        where espacio_id = ?
        order by equipo
    `

    const result = await dbSelect(sql, [espacio_id]);

    return result;
}

export async function agregar(datos, sis_usuario_id) {
    const {
        id,
        espacio_id,
        equipo_id,
        stock
    } = datos;

    if (await existente(id, espacio_id, equipo_id)) {
        return { error: true, mensaje: 'El equipo ya existe!!!' }
    }

    let sql = `
        insert into aulario_espacios_equipos
            (espacio_id, equipo_id, stock, sis_usuario_id, sis_fecha)
        values
            (?, ?, ?, ?, now())
    `

    const params = [espacio_id, equipo_id, stock, sis_usuario_id]

    const result = await dbAction(sql, params)

    return result;
}

export async function modificar(datos, sis_usuario_id) {
    const {
        id,
        espacio_id,
        equipo_id,
        stock
    } = datos;

    if (await existente(id, espacio_id, equipo_id)) {
        return { error: true, mensaje: 'El equipo ya existe!!!' }
    }

    let sql = `
        update aulario_espacios_equipos set 
            espacio_id = ?, 
            equipo_id = ?, 
            stock = ?,
            sis_usuario_id = ?, 
            sis_fecha = now()
        where id = ?
    `

    const params = [espacio_id, equipo_id, stock, sis_usuario_id, id]

    const result = await dbAction(sql, params)

    return result;
}

export async function borrar(id, sis_usuario_id) {

    let sql = `
        update aulario_espacios_equipos set 
            sis_anulado = 1 ,
            sis_usuario_id = ?, 
            sis_fecha = now()
        where id = ?
    `
    
    const params = [sis_usuario_id, id]

    const result = await dbAction(sql, params)

    return result;
}