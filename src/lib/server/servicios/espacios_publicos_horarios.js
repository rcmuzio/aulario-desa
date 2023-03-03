import { dbAction } from "../db";

export async function borrar(cod_uni, anio_academico, sis_usuario_id) {

    let f1 = anio_academico + '-03-01';
    let ff = new Date((parseInt(anio_academico) + 1), 2, 1, 1, 1);
    ff = new Date(ff.valueOf() - 24 * 60 * 60 * 1000);
    let aa = ff.getFullYear().toString();
    let mm = (ff.getMonth() + 1).toString();
    let dd = ff.getDate().toString();
    if (mm.length == 1) mm = '0' + mm;
    if (dd.length == 1) dd = '0' + dd;
    ff = aa + '-' + mm + '-' + dd;

    let sql = `
        UPDATE aulario_reserva re, aulario_espacios_publicos ep
        SET 
            re.sis_anulado = 1,
            re.sis_fecha = now(),
            re.sis_usuario_id = ?
        WHERE re.cod_uni = ?
        AND re.fecha >= ?
        AND re.fecha <= ?
        AND re.sis_anulado = 0
        AND ep.espacio_id = re.espacio_id
        AND ep.sis_anulado = 0
        AND (
            SELECT COUNT(ro.reserva_id) 
            FROM aulario_reserva_ocupada ro
            WHERE ro.reserva_id = re.id
            AND ro.sis_anulado = 0
        )=0     
    `;

    let param = [
        sis_usuario_id,
        cod_uni,
        f1,
        ff
    ]

    const result = await dbAction(sql, param);

    return result;
}