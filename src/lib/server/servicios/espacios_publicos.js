import { dbAction, dbSelect } from "../db";

// -------------------------------------------------------------
// FUNCIONES

async function existe(id){
    const sql = `
        select *
        from aulario_espacios_publicos
        where espacio_id = ?
        and sis_anulado = 0
    `;

    const filas = await dbSelect(sql, [id])

    return filas.length>0
}

// -------------------------------------------------------------
// SERVICIOS

export async function consulta(paginado, items, cod_uni, anio) {
    console.log('paginado desde servicio:', items)
    let condi = ' where tmp.cod_uni = ? ';
    let param = [cod_uni];

    items.map((i) => {
        switch (i.name) {
            case 'sede':
                condi += " and tmp." + i.name + " like concat('%',?,'%')  ";
                param.push(i.filtro)
                break;
            case 'edificio':
                condi += " and tmp." + i.name + " like concat('%',?,'%')  ";
                param.push(i.filtro)
                break;
            case 'planta':
                condi += " and tmp." + i.name + " like concat('%',?,'%')  ";
                param.push(i.filtro)
                break;
            case 'espacio':
                condi += " and tmp." + i.name + " like concat('%',?,'%')  ";
                param.push(i.filtro)
                break;
            case 'horarios':
                condi += " and tmp." + i.name + " >= ?  ";
                param.push(i.filtro)
                break;
            case 'reservadas':
                condi += " and tmp." + i.name + " >= ?   ";
                param.push(i.filtro)
                break;

        }
    })

    let f1 = anio + '-03-01';
    let f2= (anio+1) + '-03-01';

    let xxx = `
        select 
        ep.id,
        ep.espacio_id,
        se.nombre AS sede,
        ed.nombre AS edificio,
        es.planta AS planta,
        es.nombre AS espacio,
        te.tipo_espacio AS tipo_espacio,
        es.cod_uni,
        es.capacidad,
        es.capacidad_autorizada,
        es.superficie,
        es.ventilado,
        es.climatizado,
        es.verificado,
        if(
            (
                select count(re.id) 
                from aulario_reserva re 
                where re.espacio_id = ep.espacio_id 
                AND re.fecha >=  '${f1}' 
                AND re.fecha <  '${f2}' 
                and re.confirmada = 1 
                and re.sis_anulado = 0
            ) > 0,1,0
        ) AS horarios,
        (
            select count(ro.id) 
            from (aulario_reserva re join aulario_reserva_ocupada ro ) 
            where re.espacio_id = ep.espacio_id 
            AND re.fecha >=  '${f1}' 
            AND re.fecha <  '${f2}' 
            and re.confirmada = 1 
            and re.sis_anulado = 0 
            and ro.reserva_id = re.id 
            and ro.sis_anulado = 0
        ) AS reservadas,
        ep.sis_vigente,
        case ep.sis_vigente
        when 0 then 'NO' 
        when 1 then 'SI'
        end as sis_vigente_desc
        from ((((aulario_espacios_publicos ep left join aulario_espacios es on(es.id = ep.espacio_id)) left join aulario_edificios ed on(ed.id = es.edificio_id)) left join aulario_sedes se on(se.id = ed.sede_id)) left join aulario_tipo_espacio te on(te.id = es.tipo_espacio)) 
        where ep.sis_anulado = 0 
    `;

    let sql = `
        select count(tmp.id) as registros
        from (
            ${xxx}
        ) tmp
        ${condi}
    `

    console.log('MORTAL SQL:', sql)

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
        select tmp.*
        from (
            ${xxx}
        ) tmp
        ${condi}
        order by tmp.sede, tmp.edificio, tmp.espacio
        limit ${inicio}, ${paginado.rxp}
    `

    result = await dbSelect(sql, param)

    return {
        filas: result,
        paginado,
    };
}


export async function agregar(id, sis_usuario_id){

    if(await existe(id)) return {error: true, mensaje: 'El espacio ya está asignado como Espacio Público.'}

    const sql = `
        insert into aulario_espacios_publicos 
            (espacio_id, sis_usuario_id, sis_fecha)
        values
            (?, ?, now())
    `;

    const result = await dbAction(sql, [id, sis_usuario_id]);

    return result;
}


export async function borrar(data, sis_usuario_id){
    /*
        Esta función es para borrar los espacios declarados como espacios públicos
        en la tabla aulario_espacios_publicos.
        En este caso puede hacer una de dos cosas:
            1) Marcar como anulado (borrado) => (sis_anulado = 1) cuando el espacio público
               no tenga ninguna reserva (en cualquier año académico) en la tabla aulario_reserva_ocupada.
               Como consecuencia, se anularán también todos los horarios reservados en la 
               tabla aulario_reserva (sis_anulado = 1)

            2) Quitar la vigencia => (sis_vigente = 1) cuando el espacio público tenga al menos una
               reserva en la tabla aulario_reserva_ocupada (en cualquier año académico).
               Se borrarán las reservas de la tabla aulario_reserva_ocupada y los horarios de la tabla
               aulario_reserva a partir de la fecha en que se procesa la acción.
    */

    let sql = `
        SELECT count(ep.id) AS registros
        FROM 
            aulario_espacios_publicos ep, 
            aulario_reserva re, 
            aulario_reserva_ocupada ro
        WHERE ep.id = ?
        AND re.espacio_id = ep.espacio_id
        AND ro.reserva_id = re.id
        AND ro.sis_anulado = 0
    `

    // console.log('DATA:::', data)
    // return {error: false, mensaje: 'listo'}

    let filas = await dbSelect(sql,[data.id])

    let registros = filas[0].registros;

    if(registros>0){
        // no quita el espacio, pero lo marca como no vigente
        // borra los horarios reservados de la tabla aulario_reserva con fecha >= now()
        // borra las reservas de la tabla aulario_reserva_ocupada con fecha >= now()

        let sql = `
            update aulario_espacios_publicos set
                sis_vigente = 0,
                sis_fecha = now(),
                sis_usuario_id = ?
            where id = ?
        `

        let result = await dbAction(sql, [sis_usuario_id, data.id]);

        sql = `
            update aulario_espacios_publicos ep, aulario_reserva re, aulario_reserva_ocupada ro set 
                ro.sis_anulado = 1, 
                ro.sis_fecha = now(), 
                ro.sis_usuario_id = ?
            where ep.id = ?
            and re.espacio_id = ep.espacio_id 
            and date_format(re.fecha, '%Y%m%d') >= date_format(now(), '%Y%m%d')
            and ro.reserva_id = re.id
            and ro.sis_anulado = 0
        `

        result = await dbAction(sql, [sis_usuario_id, data.id]);

        sql = `
            update aulario_espacios_publicos ep, aulario_reserva re set 
                re.sis_anulado = 1, 
                re.sis_fecha = now(), 
                re.sis_usuario_id = ?
            where ep.id = ?
            and re.espacio_id = ep.espacio_id 
            and date_format(re.fecha, '%Y%m%d') >= date_format(now(), '%Y%m%d')
            and re.sis_anulado = 0
        `

        result = await dbAction(sql, [sis_usuario_id, data.id]);

    }else{

        let sql = `
            update aulario_espacios_publicos set
                sis_anulado = 1,
                sis_fecha = now(),
                sis_usuario_id = ?
            where id = ?
        `

        let result = await dbAction(sql, [sis_usuario_id, data.id]);

        sql = `
            update aulario_espacios_publicos ep, aulario_reserva re set 
                re.sis_anulado = 1, 
                re.sis_fecha = now(), 
                re.sis_usuario_id = ?
            where ep.id = ?
            and re.espacio_id = ep.espacio_id 
            and re.sis_anulado = 0
        `

        result = await dbAction(sql, [sis_usuario_id, data.id]);

        sql = `
            update aulario_espacios_publicos ep, aulario_reserva re, aulario_reserva_ocupada ro set 
                ro.sis_anulado = 1, 
                ro.sis_fecha = now(), 
                ro.sis_usuario_id = ?
            where ep.id = ?
            and re.espacio_id = ep.espacio_id 
            and ro.reserva_id = re.id
            and ro.sis_anulado = 0
        `

        result = await dbAction(sql, [sis_usuario_id, data.id]);
    }
    
    return {error: false, mensaje: 'listo'}

}