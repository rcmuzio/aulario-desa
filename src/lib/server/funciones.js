import { dbSelect } from './db';

export async function get_usuario_username(username) {
    const sql = `
        select * from usuarios where clave = '${username}'
    `

    const filas = await dbSelect(sql, []);

    // console.log('USUARIO:', filas)
    if (filas.length>0){
        return {...filas[0]}
    }else{
        return false
    }
}

export async function get_usuario_data(username) {

    let unidades_vinculadas = await dbSelect(`
        select a.id, a.usuario_id, a.sistema_id, c.cod_uni, concat(b.apellido,', ',b.nombre) as usuario, s.titulo as sistema, s.clave as clave_sistema, c.nomb_uni as unidad
        from apps_usuarios_sistemas_unidades a, usuarios b, siuc_unidades c, apps_sistemas s
        where a.sis_anulado = 0
        and b.id = a.usuario_id 
        and b.clave = '${username}'
        and b.sis_anulado = 0
        and s.id = a.sistema_id
        and s.clave = 'aulario'
        and s.sis_anulado = 0
        and c.cod_uni = a.cod_uni
        order by b.apellido, b.nombre, s.titulo, c.nomb_uni
    `,[]);


    let unidades = await dbSelect(`
        select cod_uni, nomb_uni 
        from siuc_unidades
        order by nomb_uni
    `,[]);

    return { unidades, unidades_vinculadas }
}