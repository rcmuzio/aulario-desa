
    import { 
        SIUC_CLIENT_ID,
        SIUC_URL_TOKEN,
        SIUC_REDIRECT_URI,
        SIUC_SECRET,
        SIUC_URL,
        SIUC_URL_LOGOFF,
    } from '$env/static/private';

 
/** @type {import('./$types').PageLoad} */
export async function load() {
    return {
        SIUC_URL,
        SIUC_CLIENT_ID,
        SIUC_REDIRECT_URI,
        SIUC_URL_LOGOFF
    }
}