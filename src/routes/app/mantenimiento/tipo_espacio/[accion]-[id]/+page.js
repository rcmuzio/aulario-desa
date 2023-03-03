import { error } from "@sveltejs/kit";
/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  console.log('PARAMS DE ACCION ID:', params)
  if(params.id && params.accion){
    return {...params}
  }
  
  throw error(404, "Not found");
}
