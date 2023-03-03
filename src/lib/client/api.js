import { browser } from "$app/environment";


/**
 * @typedef FetchParam
 * @type {object}
 * @property {string} ruta - URL destino
 * @property {string} method - GET POST PUT DELETE
 */

/**
 * Función fetch modificada
 * @param {Object} params - Los parámetros
 * @param {string} params.ruta - URL destino
 * @param {string} params.method - GET PSOST PUT DELETE
 * @param {boolean} params.token - Si true agrega Authorization: Beare token
 * @param {string} [params.body] - cuerpo opcional, si method es GET, no va
 * @returns {{error: boolean, mensaje: string, filas: Array}} 
 */
export async function apiFetch(params) {
    if (browser) {
        const token = JSON.parse(
            localStorage.getItem("ucc-rcm") || { refresh_token: "" }
        );

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");

        if (params.token) {
            headers.append("Authorization", params.token);
        }

       
        headers.append("refresh-token", token.refresh_token);
        // headers.append("refresh_token", $sre_usuario.refresh_token);

        const opciones = {
            method: params.method,
            headers,
        };

        if (["POST", "PUT", "DELETE"].includes(params.method)) {
            opciones.body = JSON.stringify(params.body);
        }

        const res = await fetch(params.ruta, opciones);

        return res;
    }
}
