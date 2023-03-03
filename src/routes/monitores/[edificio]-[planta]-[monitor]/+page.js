import { error } from '@sveltejs/kit';
 
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  
  if(params.edificio && params.planta && params.monitor){
    return {...params}
  }
 
  throw error(404, 'Not found');
}