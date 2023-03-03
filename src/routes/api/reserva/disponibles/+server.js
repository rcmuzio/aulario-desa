import { dbSelect } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
// export async function POST({ request }) {
//     const {fecini, fecfin, desde, hasta, filtro, paginado, dias} = await request.json();
//     let condi = ""

//     let datos = filtro
//     let pp = paginado

//     pp.rxp = parseFloat(pp.rxp)
//     pp.pagina = parseFloat(pp.pagina)

//     let condi_dias = '';

//     dias.map((d)=>{
//         if(d.checked) condi_dias += ` r.dia_sem='${d.valor}' or`
//     })

//     if(condi_dias.length>0) condi_dias = ' and ('+condi_dias.substring(0, condi_dias.length-2)+')';

//     if (datos.sede.trim().length > 0) {
//         condi += ` and sede like '%${datos.sede}%' `
//     }

//     if (datos.edificio.trim().length > 0) {
//         condi += ` and edificio like '%${datos.edificio}%' `
//     }

//     if (datos.unidad.trim().length > 0) {
//         condi += ` and unidad like '%${datos.unidad}%' `
//     }

//     if (datos.tipo_espacio.trim().length > 0) {
//         condi += ` and tipo_espacio like '%${datos.tipo_espacio}%' `
//     }

//     if (datos.espacio.trim().length > 0) {
//         condi += ` and espacio like '%${datos.espacio}%' `
//     }

//     if (datos.planta.trim().length > 0) {
//         condi += ` and planta like '%${datos.planta}%' `
//     }

//     if (datos.capacidad.trim().length > 0) {
//         condi += ` and capacidad like '%${datos.capacidad}%' `
//     }else{
//         condi += " and capacidad >= 0 "
//     }

//     if (datos.capacidad_autorizada.trim().length > 0) {
//         condi += ` and capacidad_autorizada like '%${datos.capacidad_autorizada}%' `
//     }else{
//         condi += " and capacidad_autorizada >= 0 "
//     }

// let sql = `
//     SELECT count(e.id) as registros
//     FROM aulario_v_espacios e
//     WHERE e.id not IN (
//         SELECT r.espacio_id
//         from aulario_v_reserva r
//         where r.sis_anulado=0
//         AND r.fecha BETWEEN '${fecini}' AND '${fecfin}'
//         AND (
//             ('${desde}' <=r.desde  and '${hasta}' >= r.desde) or
//             ('${desde}' <=r.hasta  and '${hasta}' >= r.hasta) or
//             ('${desde}' >=r.desde  and '${hasta}' <= r.hasta)
//         )
//         ${condi_dias}
//     )
//     ${condi}
// `

//     let x = await dbSelect(sql, []);

//     let registros = x[0].registros;

//     let paginas = 1

//     if (registros <= pp.rxp){
//         pp.pagina = 1
//     }else{
//         paginas = parseInt(registros / pp.rxp)
//     }

//     if ((registros / pp.rxp)> paginas ){
//         paginas = paginas + 1
//     }

//     let xx = pp.pagina - 1
//     let inicio = pp.rxp * xx

//     sql = `
//         SELECT e.*
//         FROM aulario_v_espacios e
//         WHERE  e.id not IN (
//             SELECT r.espacio_id
//             from aulario_v_reserva r
//             where r.sis_anulado=0
//             AND r.fecha BETWEEN '${fecini}' AND '${fecfin}'
//             AND (
//                 ('${desde}' <=r.desde  and '${hasta}' >= r.desde) or
//                 ('${desde}' <=r.hasta  and '${hasta}' >= r.hasta) or
//                 ('${desde}' >=r.desde  and '${hasta}' <= r.hasta)
//             )
//             ${condi_dias}
//         )
//         ${condi}
//         limit ${inicio},${pp.rxp}
//     `

//     let filas = await dbSelect(sql, []);

//     return json({
//         error:false,
//         datos: [...filas],
//         paginas,
//         registros,
//     })
// }

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const {
        fecini,
        fecfin,
        desde,
        hasta,
        items,
        paginado,
        dias,
    } = await request.json();

    let condi = "";

    // let datos = filtro;
    let pp = paginado;

    pp.rxp = parseFloat(pp.rxp);
    pp.pagina = parseFloat(pp.pagina);

    let condi_dias = "";

    dias.map((d) => {
        if (d.checked) condi_dias += ` r.dia_sem='${d.valor}' or`;
    });

    if (condi_dias.length > 0) {
        condi_dias = " and (" + condi_dias.substring(0, condi_dias.length - 2) + ")";
    }

    items.map((i) => {
        if (i.filtro.toString().length > 0) {
            switch (i.name) {
                case 'sede':
                    condi += ` and ${i.name} like concat('%','${i.filtro}','%') `;
                    // param.push(i.filtro)
                    break;
                case 'edificio':
                    condi += ` and ${i.name} like concat('%','${i.filtro}','%')  `;
                    // param.push(i.filtro)
                    break;
                case 'unidad':
                    condi += ` and ${i.name} like concat('%','${i.filtro}','%') `;
                    // param.push(i.filtro)
                    break;
                case 'tipo_espacio':
                    condi += ` and ${i.name} like concat('%','${i.filtro}','%')  `;
                    // param.push(i.filtro)
                    break;
                case 'espacio':
                    condi += ` and ${i.name} like concat('%','${i.filtro}','%')  `;
                    // param.push(i.filtro)
                    break;
                case 'planta':
                    condi += ` and ${i.name} like concat('%','${i.filtro}','%')  `;
                    // param.push(i.filtro)
                    break;
                case 'capacidad':
                    condi += " and " + i.name + " >= " + i.filtro ;
                    // param.push(i.filtro)
                    break;
                case 'capacidad_autorizada':
                    condi += " and " + i.name + " >= " + i.filtro ;
                    // param.push(i.filtro)
                    break;
            }
        }
    })


    let sql = `
        SELECT count(e.id) as registros
        FROM aulario_v_espacios e
        WHERE e.id not IN (
            SELECT r.espacio_id 
            from aulario_v_reserva r
            where r.sis_anulado=0
            AND r.fecha BETWEEN '${fecini}' AND '${fecfin}' 
            AND (
                ('${desde}' <=r.desde  and '${hasta}' >= r.desde) or
                ('${desde}' <=r.hasta  and '${hasta}' >= r.hasta) or
                ('${desde}' >=r.desde  and '${hasta}' <= r.hasta)
            )
            ${condi_dias}
        )
        ${condi}
    `;

    console.log('CONSULTA:',sql)

    let x = await dbSelect(sql, []);

    let registros = x[0].registros;

    let paginas = 1;

    if (registros <= pp.rxp) {
        pp.pagina = 1;
    } else {
        paginas = parseInt(registros / pp.rxp);
    }

    if ((registros / pp.rxp) > paginas) {
        paginas = paginas + 1;
    }

    let xx = pp.pagina - 1;
    let inicio = pp.rxp * xx;

    sql = `
        SELECT e.*
        FROM aulario_v_espacios e
        WHERE  e.id not IN (
            SELECT r.espacio_id 
            from aulario_v_reserva r
            where r.sis_anulado=0
            AND r.fecha BETWEEN '${fecini}' AND '${fecfin}' 
            AND (
                ('${desde}' <=r.desde  and '${hasta}' >= r.desde) or
                ('${desde}' <=r.hasta  and '${hasta}' >= r.hasta) or
                ('${desde}' >=r.desde  and '${hasta}' <= r.hasta)
            )
            ${condi_dias}
        )
        ${condi}
        limit ${inicio},${pp.rxp}
    `;

    let filas = await dbSelect(sql, []);

    return json({
        error: false,
        datos: [...filas],
        pagina: pp.pagina,
        paginas,
        registros,
    });
}
