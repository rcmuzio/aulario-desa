
import { dbAction, dbSelect } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {

    const d = await request.json()


    let importada = 0;

    let sql = `
        select *
        from siuc_materias
        where cod_uni = '${d.COD_UNI}'
        and cod_mat = '${d.COD_MAT}'       
    `

    const filas = await dbSelect(sql, []);

    d.NOMB_MATE = d.NOMB_MATE.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    d.NOMB_MAT_A = d.NOMB_MAT_A.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

    if(d.NOMB_MAT_A===null || d.NOMB_MAT_A===undefined) d.NOMB_MAT_A = d.NOMB_MATE;
    
    if (filas.length == 0) {
        let sql = `
            insert into siuc_materias 
                (cod_uni, cod_mat, nom_mat, nom_mat_a)
            values
                ('${d.COD_UNI}', '${d.COD_MAT}', '${d.NOMB_MATE}', '${d.NOMB_MAT_A}')            
        `
        let result = await dbAction(sql, []);

        importada = result ? result.affectedRows : 0;
    }

    return json({ importada });

}