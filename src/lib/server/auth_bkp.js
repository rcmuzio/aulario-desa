import jwt from 'jsonwebtoken';

import {
    SIUC_CLIENT_ID,
    SIUC_REDIRECT_URI,
    SIUC_SECRET,
    SIUC_URL,
    SIUC_URL_TOKEN,
    SIUC_URL_USER_DATA,
    SIUC_URL_REFRESH_TOKEN,
} from "$env/static/private";

import { dbAction, dbSelect } from "./db";

const sin_permiso = {
    autorizado: false,
    mensaje: 'No tiene permiso para acceder a esta página'
}

export async function user_log_on(refresh_token, path) {

    let sql = `
        select *
        from usuarios
        where token_refresh = ?
    `


    let res = await dbSelect(sql, [refresh_token])

    if (res.length == 0) return { autorizado: false, mensaje: 'No encontró refresh_token.' };

    let usuario = res[0];

    let roles = JSON.parse(usuario.roles);

    if (roles.length == 0) return { autorizado: false, mensaje: 'No tiene roles.' };

    if (usuario.clave == '0317031') roles.push('ROLE_ADMIN_AULA');
    if (usuario.clave == '9508912') roles.push('ROLE_SOPORTE_AULA');
    if (usuario.clave == '1648186') roles.push('ROLE_MANTE_AULA');

    
    if (path.startsWith('/api/mantenimiento')) {
        if (roles.includes("ROLE_MANTE_AULA") || roles.includes("ROLE_ADMIN_AULA")) {
            return { autorizado: true, id: usuario.id, username: usuario.clave }
        } else {
            return sin_permiso
        }
    }

    if (path.startsWith('/api/soporte')) {
        if (roles.includes("ROLE_SOPORTE_AULA") || roles.includes("ROLE_ADMIN_AULA")) {
            return { autorizado: true, id: usuario.id, username: usuario.clave }
        } else {
            return sin_permiso
        }
    }

    if (path.startsWith('/api/reserva')) {
        if (roles.includes("ROLE_SECRE_AULA") || roles.includes("ROLE_ADMIN_AULA")) {
            return { autorizado: true, id: usuario.id, username: usuario.clave }
        } else {
            return sin_permiso
        }
    }


    if (path.startsWith('/api/docente')) {
        if (roles.includes("ROLE_DOCENTE") || roles.includes("ROLE_ADMIN_AULA")) {
            return { autorizado: true, id: usuario.id, username: usuario.clave }
        } else {
            return sin_permiso
        }
    }

    if (path.startsWith('/api/alumno')) {
        if (roles.includes("ROLE_ALUMNO") || roles.includes("ROLE_ADMIN_AULA")) {
            return { autorizado: true, id: usuario.id, username: usuario.clave }
        } else {
            return sin_permiso
        }
    }

    if (path.startsWith('/api/publico')) {
        if (roles.includes("ROLE_ALUMNO") || roles.includes("ROLE_DOCENTE") || roles.includes("ROLE_ADMIN_AULA")) {
            return { autorizado: true, id: usuario.id, username: usuario.clave }
        } else {
            return sin_permiso
        }
    }

    return { autorizado: false, mensaje: "NO TIENE PERMISO." };
}


export async function solicitar_token(code) {
    const res = await fetch(`${SIUC_URL_TOKEN}`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            accpet: "application/json",
        },
        body: JSON.stringify({
            code: code,
            client_id: SIUC_CLIENT_ID,
            client_secret: SIUC_SECRET,
            redirect_uri: SIUC_REDIRECT_URI,
            grant_type: "authorization_code",
        }),
    });

    if (res.ok) {
        const jsn = await res.json();

        if (jsn.id_token && jsn.access_token) {
            return { error: false, ...jsn };
            // id_token = jsn.id_token;
            // const decoded = jwt.decode(jsn.id_token);
            // return await solicitar_datos_usuario(jsn.id_token, jsn.refresh_token, decoded);
        }
    } else {
        return { error: true, mensaje: "ERROR NO SE RECIBIÓ EL TOKEN" }
    }
}

export function decode_token(id_token) {
    let decoded;
    try {
        decoded = jwt.decode(id_token);
    } catch (e) {
        decoded = false;
    }
    return decoded;
}


export async function solicitar_datos_usuario(token, refresh_token, decoded) {
    const res = await fetch(
        `${SIUC_URL_USER_DATA}${decoded.cid}/user`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (res.ok) {
        const jsn = await res.json()
        return { error: false, ...jsn }
        // const x_unidades = await unidades();
        // const x_unidades_vinculadas =await unidades_vinculadas(jsn.codUnis, jsn.username);

        // const result = await actualizar_usuario(refresh_token, decoded.exp, jsn)


        // if (result.error) {
        //     return {
        //         error: true,
        //         mensaje: 'NO SE PUDO ACTUALIZAR EL USUARIO'
        //     }
        // }

        // return {
        //     error: false,
        //     id_token: token,
        //     refresh_token: refresh_token,
        //     expire_token: decoded.exp,
        //     fullName: jsn.fullName,
        //     mail: jsn.mailInstitution,
        //     ...unidades,
        //     menu: menu_usuario(jsn.username, decoded.roles)
        //     // menu: menu_usuario(jsn.username, decoded.roles, refresh_token)
        // }
    } else {
        console.log('NO SE PUDO RECUPERAR DATOS DE USUARIO')
        return { error: true, mensaje: 'NO SE PUDO RECUPERAR DATOS DE USUARIO' }
    }
}


export async function actualizar_usuario(refresh_token, expire, datos) {
    let sql = `
        select *
        from usuarios
        where clave = ?
    `

    let result = await dbSelect(sql, [datos.username])

    let usuario;

    if (result.length == 0) {
        usuario = await agregar_usuario(refresh_token, expire, datos)
    } else {
        usuario = await modificar_usuario(refresh_token, expire, datos)
    }

    return usuario

}

async function agregar_usuario(refresh_token, expire, datos) {
    let sql = `
        insert into usuarios 
            (clave, apenom, email, roles, token_refresh, token_expire)
        values
            (?, ?, ?, ?, ?, ?)
    `

    if (datos.username == '1648186') datos.roles.push('ROLE_MANTE_AULA');
    if (datos.username == '9508912') datos.roles.push('ROLE_SOPORTE_AULA');

    let param = [
        datos.username,
        datos.fullName,
        datos.mailInstitution,
        JSON.stringify(datos.roles),
        refresh_token,
        expire
    ]

    const result = await dbAction(sql, param)

    return result
}

async function modificar_usuario(refresh_token, expire, datos) {
    let sql = `
        update usuarios set
            apenom = ?, 
            email = ?,
            roles = ?, 
            token_refresh = ?, 
            token_expire = ?
        where clave = ?
    `

    if (datos.username == '1648186') datos.roles.push('ROLE_MANTE_AULA');
    if (datos.username == '9508912') datos.roles.push('ROLE_SOPORTE_AULA');

    let param = [
        datos.fullName,
        datos.mailInstitution,
        JSON.stringify(datos.roles),
        refresh_token,
        expire,
        datos.username
    ]

    const result = await dbAction(sql, param, refresh_token)

    return result
}

export async function unidades_de_gestion() {
    let unidades = await dbSelect(`
        select cod_uni, nomb_uni 
        from siuc_unidades
        order by nomb_uni
    `, []);

    return unidades
}


export async function unidades_vinculadas_al_usuario(codUnis, username) {
    let c = '';

    codUnis.map((u) => {
        c += "'" + u + "',";
    });

    let sql = '';

    if (c.length > 0) {
        c = c.substring(0, c.length - 1);
        sql = `
            select x.cod_uni, x.nomb_uni as unidad
            from usuarios u, siuc_unidades x
            where u.clave = ?
            and x.cod_uni in (${c})
        `
    } else {
        sql = `
            select x.cod_uni, x.nomb_uni as unidad
            from usuarios u, siuc_unidades x
            where u.clave = ?
        `
    }

    let unidades_vinculadas = await dbSelect(sql, [username])

    return unidades_vinculadas;
}


export function menu_usuario(clave, roles) {

    const mantenimiento = {
        menu: 'Mantenimiento',
        items: [
            { ruta: '/app/mantenimiento/tipo_articulo', titulo: 'Tipos de Artículos' },
            { ruta: '/app/mantenimiento/articulos', titulo: 'Artículos' },
            { ruta: '/app/mantenimiento/sedes', titulo: 'Sedes' },
            { ruta: '/app/mantenimiento/edificios', titulo: 'Edificios' },
            { ruta: '/app/mantenimiento/tipo_espacio', titulo: 'Tipos de Espacios' },
            { ruta: '/app/mantenimiento/espacios', titulo: 'Espacios' },
            { ruta: '/app/mantenimiento/monitores', titulo: 'Monitores' },
        ]
    }

    const soporte = {
        menu: 'Soporte Técnico IT',
        items: [
            { ruta: '/app/soporte/equipamiento', titulo: 'Equipamiento' },
            { ruta: '/app/soporte/instalaciones', titulo: 'Equipamiento instalado ' },
        ]
    }

    const secre = {
        menu: 'Secretaría',
        items: [
            { ruta: '/app/reserva', titulo: 'Reservas' },
        ]
    }

    const alumno = {
        menu: 'Alumno',
        items: [
            { ruta: '/app/alumno/agenda', titulo: 'Agenda clases' },
            { ruta: '/app/alumno/reservas', titulo: 'Mis reservas' },
        ]
    }

    const docente = {
        menu: 'Docente',
        items: [
            { ruta: '/app/docente/agenda', titulo: 'Agenda clases' },
        ]
    }

    let menu = []

    for (let rol of roles) {
        switch (rol) {
            case "ROLE_MANTE_AULA":
                menu.push(mantenimiento)
                break;
            case "ROLE_SOPORTE_AULA":
                menu.push(soporte)
                break;
            case "ROLE_SECRE_AULA":
                menu.push(secre)
                break;
            case "ROLE_DOCENTE":
                menu.push(docente)
                break;
            case "ROLE_ALUMNO":
                menu.push(alumno);
                break;
        }
    }

    // MENU VALIDO
    // MENU RCM

    if(clave=="0317031"){
        menu = []
        menu.push(mantenimiento)
        menu.push(soporte)
        menu.push(secre)
        menu.push(docente)
        menu.push(alumno)
    }

    if(clave=="9508912"){
        menu = []
        menu.push(soporte)
    }

    if(clave=="1648186"){
        menu = []
        menu.push(mantenimiento)
    }

    return menu
}

export async function solicitar_nuevo_token(refresh_token) {
    const res = await fetch(
        `${SIUC_URL_REFRESH_TOKEN}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
        },
        body: JSON.stringify({
            refresh_token,
            client_id: SIUC_CLIENT_ID,
            client_secret: SIUC_SECRET
        })
    });

    if(res.ok){
        const jsn = await (await res).json();
        return {
            error: false,
            ...jsn
        }
    } else {
        return {
            error: true,
            mensaje: 'El token no fue renovado',
        }   
    }

}