import { error } from '@sveltejs/kit';
 
/** @type {import('./$types').PageLoad} */
export function load({ params }) {

  if (params.accion && params.id) {
    return {...params};
  }
 
  throw error(404, 'La ruta no es válida.');
}