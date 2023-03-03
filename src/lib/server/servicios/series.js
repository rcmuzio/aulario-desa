import { dbAction, dbSelect } from "../db";

export async function leer(serie){

    let sql = `
        select *
        from aulario_v_series
        where serie= ?
    `
    
    let filas = await dbSelect(sql, [serie])
    
    return filas;
}

export async function agregar(params, sis_usuario_id) {

    let fi = new Date(params.desde + ' 00:00:01');
    let ff = new Date(params.hasta + ' 00:00:00');

    let dia_semana = fi.getDay(); //params.fecha.weekday()
    let primer_domingo = new Date(fi.getTime() - (60 * 60 * 24 * 1000 * dia_semana));

    // let serie = uuidv4();
    let serie = crypto.randomUUID();

    let xhorarios = JSON.stringify(params.horarios)

    let sql = `
        insert into aulario_series
        (
            serie,
            espacio_id,
            cod_uni,
            cod_car,
            cod_mate,
            cod_prof,
            curso,
            catedra,
            comision,
            descri,
            tipo_acti,
            desde,
            hasta,
            horarios,
            sis_fecha,
            sis_usuario_id
        ) values (
            '${serie}',
            '${params.espacio_id}',
            '${params.cod_uni}',
            '${params.cod_car}',
            '${params.cod_mate}',
            '${params.cod_prof}',
            '${params.curso}',
            '${params.catedra}',
            '${params.comision}',
            '${params.descri}',
            '${params.tipo_acti}',
            '${params.desde}',
            '${params.hasta}',
            '${xhorarios}',
            now(),
            '${sis_usuario_id}'            
        )   
    `
    let nuevo_id = await dbAction(sql, [])

    for (const h of params.horarios) {

        let i = 1;
        for (const d of h.dias) {

            if (d) {
                let fx = primer_domingo;

                while (fx <= ff) {

                    let ddd = fx.getDate().toString()
                    let mmm = (fx.getMonth() + 1).toString()
                    let aaa = fx.getFullYear().toString()
                    if (ddd.length < 2) ddd = '0' + ddd;
                    if (mmm.length < 2) mmm = '0' + mmm;
                    let fff = aaa + '-' + mmm + '-' + ddd;

                    if (fx >= fi && fx <= ff) {

                        if (fx.getDay() == i) {
                            let sql = `
                                insert into aulario_reserva
                                (
                                    espacio_id, serie, cod_uni, cod_car, cod_mate, cod_prof, curso, catedra, comision, descri, tipo_acti, confirmada, fecha, desde, hasta, sis_usuario_id
                                )
                                select
                                    '${params.espacio_id}', '${serie}', '${params.cod_uni}', '${params.cod_car}', '${params.cod_mate}', '${params.cod_prof}', '${params.curso}', '${params.catedra}', '${params.comision}', '${params.descri}', '${params.tipo_acti}', '1', '${fff}', '${h.desde}', '${h.hasta}', '${sis_usuario_id}'
                                from aulario_espacios e
                                where e.id = '${params.espacio_id}'
                                    and e.sis_anulado = 0
                                    and e.disponible = 1
                                    and (
                                        select count(x.id)
                                        from aulario_reserva x
                                        where x.espacio_id = '${params.espacio_id}'
                                        and x.sis_anulado = 0
                                        and x.confirmada = 1
                                        and x.fecha = '${fff}'
                                        and (
                                            ('${h.desde}' <= x.desde and x.desde <= '${h.hasta}') or ('${h.desde}' <= x.hasta and x.hasta <= '${h.hasta}') or
                                            ('${h.desde}' <= x.desde and x.hasta <= '${h.hasta}') or ('${h.desde}' >= x.desde and x.hasta >= '${h.hasta}')
                                        )
                                    ) = 0
                                    and (
                                        select count(x.id)
                                        from aulario_reserva x
                                        where x.cod_prof = '${params.cod_prof}'
                                        and x.cod_prof > ''
                                        and x.sis_anulado = 0
                                        and x.confirmada = 1
                                        and x.fecha = '${fff}'
                                        and (
                                            ('${h.desde}' <= x.desde and x.desde <= '${h.hasta}') or ('${h.desde}' <= x.hasta and x.hasta <= '${h.hasta}') or
                                            ('${h.desde}' <= x.desde and x.hasta <= '${h.hasta}') or ('${h.desde}' >= x.desde and x.hasta >= '${h.hasta}')
                                        )
                                    ) = 0    
                            `

                            console.log('AGERGAR AGENDA:', sql)
                            let r = await dbAction(sql, [])
                            console.log('NUEVA RESERVA:', r)
                            if (r.affectedRows == 0 || r.affectedRows == undefined) {

                                let sql = `
                                    insert into aulario_reserva
                                    (
                                        espacio_id, serie, cod_uni, cod_car, cod_mate, cod_prof, curso, catedra, comision, descri, tipo_acti, confirmada, fecha, desde, hasta, sis_usuario_id, sp_docente, sp_actividad
                                    )
                                    values
                                    (
                                        '${params.espacio_id}', '${serie}', '${params.cod_uni}', '${params.cod_car}', '${params.cod_mate}', '${params.cod_prof}', '${params.curso}', '${params.catedra}', '${params.comision}', '${params.descri}', '${params.tipo_acti}', '0', '${fff}', '${h.desde}', '${h.hasta}', '${sis_usuario_id}',
                                        (
                                            select count(x.id)
                                            from aulario_reserva x
                                            where x.cod_prof = '${params.cod_prof}'
                                            and x.sis_anulado = 0
                                            and x.confirmada = 1
                                            and x.fecha = '${fff}'
                                            and (
                                                ('${h.desde}' <= x.desde and x.desde <= '${h.hasta}') or ('${h.desde}' <= x.hasta and x.hasta <= '${h.hasta}') or
                                                ('${h.desde}' <= x.desde and x.hasta <= '${h.hasta}') or ('${h.desde}' >= x.desde and x.hasta >= '${h.hasta}')
                                            )
                                        ),
                                        (
                                            select count(x.id)
                                            from aulario_reserva x
                                            where x.espacio_id = '${params.espacio_id}'
                                            and x.sis_anulado = 0
                                            and x.confirmada = 1
                                            and x.fecha = '${fff}'
                                            and (
                                                ('${h.desde}' <= x.desde and x.desde <= '${h.hasta}') or ('${h.desde}' <= x.hasta and x.hasta <= '${h.hasta}') or
                                                ('${h.desde}' <= x.desde and x.hasta <= '${h.hasta}') or ('${h.desde}' >= x.desde and x.hasta >= '${h.hasta}')
                                            )
                                        )
                                    )
                                `

                                let reserva_no_confirmada_id = await dbAction(sql, [])
                            }
                        }
                    }
                    fx = new Date(fx.getTime() + (60 * 60 * 24 * 1000));
                }
            }
            i++;
        }
    }

    return serie;
}

export async function borrar(serie, sis_usuario_id) {

    let sql = `
        update aulario_series set
        sis_anulado = 1,
        sis_usuario_id = '${sis_usuario_id}',
        sis_fecha = now()
        where serie = '${serie}'    
    `

    // console.log('BORRAR:', sql)
    let res = await dbAction(sql, []);

    return { res }
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

    return { res }
}