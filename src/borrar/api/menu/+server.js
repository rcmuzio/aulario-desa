import { dbSelect } from '$lib/server/db';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const {refresh_token}= await request.json()

    if(!refresh_token){
        return json({
            error: true,
            mensaje: 'Debe iniciar sesión nuevamente.'
        })
    }

    let sql = `
        select clave, roles 
        from usuarios
        where token_refresh = ?
    `

    let result = await dbSelect(sql, [refresh_token])

    if(result.length==0){
        return json({
            error: true,
            mensaje: 'Debe iniciar sesión nuevamente.'
        })
    }

    const usuario = result[0];

    if(usuario.clave=='0317031'){
        return  json({
            error: false,
            titulo: 'Módulos',
            menu: [
                {opcion: "Mantenimiento", ruta: "/app/mantenimiento"},
                {opcion: "Soporte", ruta: "/app/soporte"},
                {opcion: "Biblioteca", ruta: "/app/biblioteca"},
                {opcion: "Alumno", ruta: "/app/alumno"},
                {opcion: "Docente", ruta: "/app/docente"},
            ]
        })
    }

    const roles = JSON.parse(usuario.roles)

    return  json({
        error: false,
        titulo: 'Mantenimiento',
        menu: [
            {opcion: "Sedes", ruta: "/app/mantenimiento/sedes"},
            {opcion: "Edificios", ruta: "/app/mantenimiento/edificios"},
        ]
    })

    return json(result)
}