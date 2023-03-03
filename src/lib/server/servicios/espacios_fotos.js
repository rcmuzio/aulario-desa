import { dbAction, dbSelect } from "../db";

export async function consultar(id) {
    const sql = `
    select * 
    from aulario_espacios_fotos
    where espacio_id = ?
    and sis_anulado = 0
`

    let filas = await dbSelect(sql, [id])

    let fotos = []

    if (filas.length > 0) {
        filas.map((f) => {
            fotos.push({
                id: f.id,
                type: f.tipo,
                base64: f.foto.toString()
            })
        })
    }

    return fotos;
}


export async function agregar(espacio_id, type, base64, sis_usuario_id){
    let sql  = `
    insert into aulario_espacios_fotos 
        (espacio_id, foto, tipo, sis_fecha, sis_usuario_id)
    values
        (?, ?, ?, now(), ?)
    `

    const result = await dbAction(sql, [espacio_id, base64, type, sis_usuario_id]);

    console.log('AGREGAR FOTO RESULT:', result);

    return result;
}


export async function borrar(id, sis_usuario_id){
    let sql  = `
        update aulario_espacios_fotos set
            sis_anulado = 1,
            sis_usuario_id = ?,
            sis_fecha = now()
        where id = ?
    `

    const result = await dbAction(sql, [sis_usuario_id, id]);

    console.log('BORRAR FOTO RESULT:', result);

    return result;
}

// async function actualizar_fotos(espacio_id, fotos){

//     let sqlFoto = "";

//     if (fotos.length > 0) {
//         for (const f of fotos) {
//             if (f.id == 0) {
//                 sqlFoto = `
//                     insert into aulario_espacios_fotos 
//                         (espacio_id, foto, tipo)
//                     values
//                         ('${espacio_id}','${f.base64}', '${f.type}')
//                 `
//             }else{
//                 if(f.eliminar){
//                     sqlFoto = `
//                         delete from aulario_espacios_fotos 
//                         where id = '${f.id}'
//                     `
//                 }else{
//                     sqlFoto = `
//                         update aulario_espacios_fotos set 
//                             foto = '${f.base64}', 
//                             tipo = '${f.type}'
//                         where id = '${f.id}'
//                     `  
//                 }
//             }
//             await actualizar(sqlFoto);
//         }
//     }else{
//         sqlFoto = `
//             delete from aulario_espacios_fotos 
//             where espacio_id = '${espacio_id}'
//         `
//         await actualizar(sqlFoto);
//     }
// }
