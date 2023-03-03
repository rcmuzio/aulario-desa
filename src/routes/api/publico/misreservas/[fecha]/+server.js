import { sin_permiso } from '$lib/server/constantes';
import { dbSelect } from '$lib/server/db';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
    if(!locals.usuario || !locals.usuario.autorizado){
        return json(sin_permiso);
    }
    
    const usuario = locals.usuario || {id:999999}
    const fecha=params.fecha;
    const cod_uni=params.cod_uni;

    // return json({fecha, usuario})

    console.log('LOCALS.USUARIO:', locals.usuario)
    console.log('USUARIO:', usuario)

    let sql = `
        select *
        from aulario_v_reserva_ocupada 
        where fecha = ?
        and usuario_id = ?
    `

    let param = [fecha, usuario.id]

    const filas = await dbSelect(sql, param)

    return json(filas)
    
    // if (!usuario.autorizado) return json({ error: true, ...usuario });

    // let sql = `
    //     insert into aulario_reserva_ocupada
    //         (reserva_id, usuario_id, sis_usuario_id, sis_fecha)

    //     select ?, ?, ?, now()
    //     from dual
    //     where (
    //         select count(x.id)
    //         from aulario_reserva_ocupada x
    //         where x.id = ?
    //         and x.sis_anulado = 0
    //     ) = 0
    // `

    // const param = [
    //     reserva_id,
    //     locals.usuario.id,
    //     locals.usuario.id,
    //     reserva_id
    // ]

    // let result = await dbAction(sql, param)


    // return json({
    //     error: false,
    //     mensaje: 'Reserva confirmada',
    //     nuevo_id: result
    // })

}
