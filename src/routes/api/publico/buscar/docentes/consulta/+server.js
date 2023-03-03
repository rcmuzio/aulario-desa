import { dbSelect } from '$lib/server/db';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {

    const data = await request.json()

    // datos = cLimpiar(datos)

    let condi = ""
    let params = {}

    let datos = data.filtro
    let pp = data.paginado

    pp.rxp = parseFloat(pp.rxp)
    pp.pagina = parseFloat(pp.pagina)

    if (datos.cod_prof.trim().length > 0) {
        condi += ` and cod_prof like '%${datos.cod_prof}%' `
    }

    if (datos.apellido.trim().length > 0) {
        condi += ` and apellido like '%${datos.apellido}%' `
    }

    if (datos.nombre.trim().length > 0) {
        condi += ` and nombre like '%${datos.nombre}%' `
    }

    let sql = `
        select count(cod_prof) as registros
        from siuc_docentes
        where cod_prof > '0'
        ${condi}
    `   

    let x = await dbSelect(sql,[]);

    let registros = x[0].registros;

    let paginas = 1

    if (registros <= pp.rxp){
        pp.pagina = 1
    }else{
        paginas = parseInt(registros / pp.rxp)
    }

    if ((registros / pp.rxp)> paginas ){
        paginas = paginas + 1
    }

    let xx = pp.pagina - 1
    let inicio = pp.rxp * xx


    sql = `
        select *
        from siuc_docentes
        where cod_prof > '0'
        ${condi}
        order by apellido, nombre
        limit ${inicio},${pp.rxp}
    `

    let filas = await dbSelect(sql, []);

    // return {
    //     body: { "datos": filas, "registros": registros, "paginas": paginas }
    // }

    return json({ "datos": filas, "registros": registros, "paginas": paginas })
}

