import { solicitar_token } from '$lib/server/auth';

import {
    SIUC_CLIENT_ID,
    SIUC_REDIRECT_URI,
    SIUC_SECRET,
    SIUC_URL,
    SIUC_URL_TOKEN,
    SIUC_URL_USER_DATA,
    SIUC_URL_REFRESH_TOKEN,
} from "$env/static/private";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
    /*  
        Desde la api de login de siuc, nos envían 
        una solicitud GET con una variable code
        Con esta variable code enviamos una solicitud a siuc
        para que nos devuelva un token con el cual podremos
        obtener los datos del usuario que intenta iniciar
        sesión.
    */
    const code = url.searchParams.get("code") || "nada";

    console.log('+page.serer.js CODE:=', code)

    if (code == 'nada') {
        return {
            error: true,
            mensaje: "Inicio de sesión inválida"
        }
    }

    let datos = await solicitar_token(code);

    return datos;
}
