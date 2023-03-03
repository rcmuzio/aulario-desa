import { dbAction, dbSelect } from "../db";

export async function leerId(id){
    let sql =`
        select *
        from aulario_reserva_param
        where id = ?
    `
    let param= [id]

    const filas = await dbSelect(sql, param)

    if(filas.length>0){
        return filas[0]
    }else{
        return {error: true}
    }
}

export async function leerCodUni(cod_uni){
    let sql =`
        select *
        from aulario_reserva_param
        where cod_uni = ?
        and sis_anulado = 0
    `
    let param= [cod_uni]

    const filas = await dbSelect(sql, param)

    if(filas.length>0){
        return filas[0]
    }else{
        return {error: true}
    }
}

export async function crear(cod_uni, max_reserva_dia, sis_usuario_id){
    let sql = `
        insert into aulario_reserva_param 
            (cod_uni, max_reserva_dia, sis_usuario_id, sis_fecha)
        values
            (?, ?, ?, now())
    `;

    let param = [cod_uni, max_reserva_dia, sis_usuario_id];

    const result = await dbAction(sql, param);

    return result;
}

export async function modificar(cod_uni, max_reserva_dia, sis_usuario_id){
    let sql = `
        update aulario_reserva_param set
            max_reserva_dia = ?, 
            sis_usuario_id = ?,
            sis_fecha = now()
        where cod_uni = ?
        and sis_anulado = 0
    `;

    let param = [max_reserva_dia, sis_usuario_id, cod_uni];

    const result = await dbAction(sql, param);
}