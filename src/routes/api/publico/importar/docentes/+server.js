
import { dbAction, dbSelect } from "$lib/server/db";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {

    const d = await request.json()


    let importado = 0;

    let sql = `
        select *
        from siuc_docentes
        where cod_prof = '${d.COD_PROF}'       
    `

    const filas = await dbSelect(sql, []);

    if (filas.length == 0) {
        d.APELLIDO = d.APELLIDO.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
        d.NOMBRE = d.NOMBRE.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');

        let sql = `
        insert into siuc_docentes 
            (cod_prof, num_doc, apellido, nombre, email)
        values
            ('${d.COD_PROF}', '${d.NUM_DOC}', '${d.APELLIDO}', '${d.NOMBRE}', '${d.E_MAIL}')          
        `
        let result = await dbAction(sql, []);
        // console.log(result)
        importado = result ? result.affectedRows : 0;
    }


    return json({ importado });
}