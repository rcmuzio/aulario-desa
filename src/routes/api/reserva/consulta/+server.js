import { dbSelect } from "$lib/server/db";
import { json } from "@sveltejs/kit";

function fmt_fecha(f) {
    let d = f.getDate().toString();
    let m = (f.getMonth() + 1).toString();
    let a = f.getFullYear().toString();
    if (d.length == 1) d = '0' + d;
    if (m.length == 1) m = '0' + m;
    return a + '-' + m + '-' + d;
}


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {

    const params = await request.json()

    // let xx = [0,1,2,3,4,5,6]
    let fec = new Date(params.fecha + ' 00:00:01')
    let dia_semana = fec.getDay(); //params.fecha.weekday()
    let domingo = new Date(fec.getTime() - (60 * 60 * 24 * 1000 * dia_semana));
    let sabado = new Date(domingo.getTime() + (60 * 60 * 24 * 1000 * 6));

    let dom = fmt_fecha(domingo) //.toLocaleDateString(); //.substring(0,10)
    let sab = fmt_fecha(sabado); //.toString().substring(0,10)



    let sql = `
        select r.id, r.serie, 
        date_format(r.fecha, '%Y-%m-%d') as fecha, 
        date_format(r.fecha,'%e') AS num_dia,
        case date_format(r.fecha,'%w') when 0 then 'Domingo' when 1 then 'Lunes' when 2 then 'Martes' when 3 then 'Miércoles' when 4 then 'Jueves' when 5 then 'Viernes' when 6 then 'Sábado' end AS dia,
        case date_format(r.fecha,'%b') when 'Jan' then 'Ene' when 'apr' then 'Abr' when 'aug' then 'Ago' when 'dec' then 'Dic' else date_format(r.fecha,'%b') end AS nom_mes,
        case date_format(r.fecha,'%c') when 1 then 'Eenero' when 2 then 'Febrero' when 3 then 'Marzo' when 4 then 'Abril' when 5 then 'Mayo' when 6 then 'Junio' when 7 then 'Julio' when 8 then 'Agosto' when 9 then 'Septiembre' when 10 then 'Octubre' when 11 then 'Noviembre' when 12 then 'Diciembre' end AS mes,
        cast(date_format(r.desde,'%H') as unsigned) AS hora,
        date_format(r.fecha, '%w') as diasem,
        date_format(r.desde,'%H:%i') AS desde,
        date_format(r.hasta,'%H:%i') AS hasta,
        cast(concat(cast(date_format(r.desde,'%H') as signed),'.',substr(cast(date_format(r.desde,'%i') as signed) / 60,3,2)) as float) AS d,
        cast(concat(cast(date_format(r.hasta,'%H') as signed),'.',substr(cast(date_format(r.hasta,'%i') as signed) / 60,3,2)) as float) AS h,
        r.descri,
        r.espacio_id,
        a.nombre as espacio,
        a.planta,
        a.capacidad,
        a.capacidad_autorizada,
        a.climatizado,
        a.ventilado,
        a.sis_vigente,
        u.cod_uni as key_uni,
        u.nomb_uni as unidad,
        e.nombre AS edificio,
        s.nombre AS sede,
        x.cod_uni AS cod_uni,
        x.nomb_uni AS unidad_academica,
        x.color ,
        x.color_letra,
        ifnull(r.cod_car,'') as cod_car,
        ifnull(c.nomb_carr,'') AS carrera,
        ifnull(r.cod_mate,'') as cod_mate,
        ifnull(m.nom_mat,'') AS materia,
        ifnull(r.curso,'') as curso,
        ifnull(r.catedra,'') as catedra,
        ifnull(r.comision,'') as comision,
        ifnull(r.cod_prof,'') as cod_prof,
        concat(ifnull(d.apellido,''),' ',ifnull(d.nombre,'')) AS docente,
        r.tipo_acti,
        r.confirmada,
        r.suspendida,
        r.suspendida_motivo,
        case r.confirmada when 0 then 'NO' when 1 then 'SI' end AS confirmado,
        case r.confirmada when 0 then 'red' when 1 then 'black' end AS confirmado_color,
        ifnull(uu.apenom,'') AS usuario,
        r.sis_fecha

        from aulario_reserva r
        left join aulario_espacios a
            on a.id = r.espacio_id and a.sis_anulado=0
        left join aulario_edificios e
            on e.id = a.edificio_id and e.sis_anulado = 0
        left join aulario_sedes s
            on s.id = e.sede_id and s.sis_anulado = 0
        left join siuc_unidades u
            on u.cod_uni = a.cod_uni
        left join siuc_unidades x
            on x.cod_uni = r.cod_uni
        left join siuc_carreras c
            on c.cod_uni = r.cod_uni and c.cod_carr = r.cod_car
        left join siuc_materias m
            on m.cod_uni = r.cod_uni and m.cod_mat = r.cod_mate
        left join siuc_docentes d
            on d.cod_prof = r.cod_prof
        left join usuarios uu
            on uu.id = r.sis_usuario_id 
        where r.fecha between '${dom}' and '${sab}'
        and r.sis_anulado=0
        and r.confirmada=1
    `;

    switch (params.vista) {
        case 1:
            sql += ` and x.cod_uni = '${params.cod_uni}' `;
            break;
        case 3:
            sql += ` and x.cod_uni = '${params.cod_uni}' and u.cod_uni != '${params.cod_uni}'`;
            break;
        case 4:
            sql += ` and x.cod_uni != '${params.cod_uni}' and u.cod_uni = '${params.cod_uni}'`;
            break;
        default:
            sql += ` and u.cod_uni = '${params.cod_uni}' `;
            switch (params.espacio_id) {
                case '0':
                    ` and r.espacio_id>0 `;
                    break;
                case 'PU':
                    sql += ` and r.espacio_id in (
                        select zz.espacio_id
                        from aulario_espacios_publicos zz
                        where zz.sis_anulado = 0
                    ) `;
                    break;
                case 'PO':
                    sql += ` and (
                        select count(zz.id)
                        from aulario_reserva_ocupada zz
                        where zz.reserva_id = r.id and zz.sis_anulado = 0
                    )>0 `;
                    break;
                default:
                    sql += ` and r.espacio_id = ${params.espacio_id} `;
                    break;
            }
    }

    // if (params.vista == 1) {
    //     sql += ` and x.cod_uni = '${params.cod_uni}' `
    // } else {
    //     sql += ` and u.cod_uni = '${params.cod_uni}' `
    //     if (params.espacio_id > 0) {
    //         sql += ` and r.espacio_id = ${params.espacio_id} `
    //     }
    // }

    // sql += ' order by r.fecha, r.desde '

    sql = 'select xx.* from (' + sql + ') xx ';


    if (params.buscar_texto && params.buscar_texto.length > 0) {
        sql += ` where 
            xx.cod_prof like '%${params.buscar_texto}%'  or 
            xx.docente like '%${params.buscar_texto}%'  or 
            xx.materia like '%${params.buscar_texto}%'  or 
            xx.cod_mate like '%${params.buscar_texto}%'  or 
            xx.carrera like '%${params.buscar_texto}%'  or 
            xx.descri like '%${params.buscar_texto}%'  or 
            xx.espacio like '%${params.buscar_texto}%' or
            xx.unidad_academica like '%${params.buscar_texto}%'
        `
    }

    sql += ' order by xx.fecha, xx.desde ';

    let filas = await dbSelect(sql, [])

    let dias = []
    let nomdia = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
    let nommes = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    let array_horas = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    for (let d = 0; d < 7; d++) {
        let xd = new Date(domingo.getTime() + (60 * 60 * 24 * 1000 * d));
        let xm = xd.getMonth()
        let fecha_temp = fmt_fecha(xd);
        let num_dia = xd.getDate();

        let color_dia = "grey"
        let color = "white"

        if (d == dia_semana) {
            color_dia = "#F1E8E6"
            color = "black"
        }

        let dd = {
            dia: d,
            nombre: nomdia[d],
            nom_mes: nommes[xm],
            num_dia: num_dia,
            fecha: fecha_temp,
            horas: [],
            color_dia,
            color,
        }

        array_horas.map((xh) => {

            let xxh = {
                hora: xh,
                detalle: []
            }

            xxh.detalle = filas.filter((f) => {

                if (f.fecha == fecha_temp && f.diasem == d && f.hora == xh) {
                    // return f
                    return json(f)
                }
            })

            dd.horas.push(xxh)
        })

        dias.push(dd)
    }

    // return {
    //     body: [...dias]
    // }

    return json([...dias]);

}